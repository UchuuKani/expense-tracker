const router = require("express").Router();
const client = require("../db");
const extendedQueries = require("../queries");
const { tagParser } = require("../../utils");

router.get("/", async (req, res, next) => {
  try {
    const query = extendedQueries.getAllUsers;
    const { rows } = await client.query(query);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

//gets a user and all of their transactions
router.get("/:id", async (req, res, next) => {
  try {
    const userQuery = "SELECT users.* FROM users WHERE id = $1";
    const user = await client.query(userQuery, [req.params.id]);

    if (!user.rows.length) {
      const new404 = new Error("User not found");
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
router.post("/", async (req, res, next) => {
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
router.post("/:id", async (req, res, next) => {
  try {
    let { description, amount, date, tags } = req.body;
    // request body comes in as {description: string, amount: string, tags: string, date: string}
    // amount needs to be parsed into a number and then multiplied by 100 to convert from dollars to cents
    // tags comes in as a string and should be processed into an array of type string, string[] - this will be done by the tagParser utility function

    // have to process tags to insert into table, assuming it is a comma separated string
    // tagParser(tags: string): string[]
    const processedTags = tagParser(tags);

    const {
      postNewUserTransaction,
      insertOrDoNothingTag,
      insertTagOnTransaction,
    } = extendedQueries;

    // post transaction to transactions table
    // rows is an array that contains a single object with transaction's id, user_id, description, amount, and transaction_date
    const { rows } = await client.query(postNewUserTransaction, [
      description,
      parseInt(amount),
      req.params.id,
    ]);

    let [transactionResponse] = rows;
    let transactionId = transactionResponse.id;
    console.log("row data", transactionResponse);

    // try to create every tag in the list in the database
    // output is an array of the length of tags - current query does not work as expected - tags seem to be posted but no
    // return values
    const insertTagsArr = await Promise.all(
      processedTags.map((tag) => {
        return client.query(insertOrDoNothingTag, [tag]);
      })
    );

    // assume insertTagsArr is an array of numbers representing the id's for all the tags that were inserted
    // make associations in tags_transactions table
    await Promise.all(
      insertTagsArr.map((id) => {
        return client.query(insertTagOnTransaction, [transactionId, id]);
      })
    );

    res.json(transactionResponse); //rewrite to send back newly created task or redirect to task list for user
  } catch (err) {
    next(err);
  }
});

module.exports = router;
