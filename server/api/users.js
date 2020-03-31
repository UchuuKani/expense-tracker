const router = require('express').Router();
const client = require('../db');
const extendedQueries = require('../queries');
const { tagParser } = require('../../utils');

router.get('/', async (req, res, next) => {
  try {
    const query = extendedQueries.getAllUsers;
    const { rows } = await client.query(query);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

//gets a user and all of their transactions
router.get('/:id', async (req, res, next) => {
  try {
    const userQuery = 'SELECT users.* FROM users WHERE id = $1';
    const user = await client.query(userQuery, [req.params.id]);

    if (!user.rows.length) {
      const new404 = new Error('User not found');
      new404.status = 404;
      throw new404;
    }

    const userData = user.rows[0];

    const query = extendedQueries.followUpUserId;
    const { rows } = await client.query(query, [req.params.id]);

    const userWithTransactions = { ...userData, transactions: rows };

    // this 404 check is in place for when I only make one query instead of two
    // if (!rows.length) {
    //   const new404 = new Error('User not found');
    //   new404.status = 404;
    //   throw new404;
    // }

    res.send(userWithTransactions);
  } catch (err) {
    next(err);
  }
});

//posts a new user to the database
router.post('/', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const query = extendedQueries.postNewUser;

    const { rows } = await client.query(query, [name, email]);

    res.status(201).send(rows[0]);
  } catch (err) {
    next(err);
  }
});

//QUERY NOT COMPLETE - DOES NOT ADD TO TAGS JOIN TABLE
//posts a new transcation for a specific user, and includes tags
router.post('/:id', async (req, res, next) => {
  try {
    let { description, amount, tags, date } = req.body;
    // request body comes in as {description: string, amount: string, tags: string, date: string}
    // amount needs to be parsed into a number and then multiplied by 100 to convert from dollars to cents
    // tags comes in as a string and should be processed into an array of type string, string[] - this will be done by the tagParser utility function

    //have to process tags to insert into table, assuming it is a comma separated string
    const queryTransactions = extendedQueries.postNewUserTransaction;
    const { rows } = await client.query(queryTransactions, [
      description,
      amount,
      date,
      req.params.id,
    ]);

    let response = rows.data;

    // TODO - add logic for adding tags to a transaction in join table and tags table - use Postgres UPSERT

    res.json(response); //rewrite to send back newly created task or redirect to task list for user
  } catch (err) {
    next(err);
  }
});

module.exports = router;
