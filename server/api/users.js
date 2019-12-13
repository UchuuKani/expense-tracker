const router = require("express").Router();
const client = require("../db");
const extendedQueries = require("../queries");

router.get("/", async (req, res, next) => {
  try {
    const query = extendedQueries.getAllUsers;
    const {rows} = await client.query(query);

    res.json(rows);
  } catch(err) {
    next(err);
  }
});

//gets a user and all of their transactions
router.get("/:id", async (req, res, next) => {
  try {
    const query = extendedQueries.getUserIdTransactions;
    const {rows} = await client.query(query, [req.params.id]);

    // const {rows} = await client.query(query);
    if (!rows.length) {
      const new404 = new Error("User not found");
      new404.status = 404;
      throw new404;
    }

    res.send(rows[0].user);
  } catch(err) {
    next(err);
  }
})

//gets a specific user's specific transaction
router.get("/:id/transactions/:transactionId", async (req, res, next) => {
  try {
    const query = "SELECT description, amount FROM users LEFT JOIN transactions USING (user_id) WHERE user_id = $1";
    const {rows} = await client.query(query, [req.params.id]);

    res.send(rows)
  } catch(err) {
    next(err);
  }
})

//posts a new user to the database
router.post("/", async (req, res, next) => {
  try {
    const {name, email} = req.body
    const query = extendedQueries.postNewUser;

    const {rows} = await client.query(query, [name, email]);

    res.status(201).send(rows[0]);
  } catch(err) {
    next(err);
  }
});

//QUERY NOT COMPLETE - DOES NOT ADD TO TAGS JOIN TABLE
//posts a new transcation for a specific user, and includes tags
router.post("/:id", async (req, res, next) => {
  try {
    const {description, amount, tags} = req.body;
    //have to process tags to insert into table

    //post into transactions, tags, and tags_transactions

    const query = extendedQueries.postNewUserTransaction;
    const {rows} = await client.query(query, [description, amount, req.params.id])

    res.status(201).send(rows[0]); //rewrite to send back newly created task or redirect to task list for user
  } catch(err) {
    next(err);
  }
});

module.exports = router;
