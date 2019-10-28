const router = require("express").Router();
const client = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const query = "SELECT users.* FROM users";
    const {rows} = await client.query(query);

    res.json(rows);
  } catch(err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const query = "SELECT users.* FROM users WHERE users.id = $1";
    const {rows} = await client.query(query, [req.params.id]);

    if (!rows.length) {
      const new404 = new Error("Page not found");
      new404.status = 404;
      throw new404;
    }

    res.json(rows[0]);
  } catch(err) {
    next(err);
  }
});

router.get("/:id/transactions", async (req, res, next) => {
  try {
    const query = "SELECT description, amount FROM users LEFT JOIN transactions USING (userId) WHERE userId = $1";
    const {rows} = await client.query(query, [req.params.id]);

    res.send(rows)
  } catch(err) {
    next(err);
  }
})

//route to grab specific transaction
router.get("/:id/transactions/:transactionId", async (req, res, next) => {
  try {
    const query = "SELECT description, amount FROM users LEFT JOIN transactions USING (userId) WHERE userId = $1";
    const {rows} = await client.query(query, [req.params.id]);

    res.send(rows)
  } catch(err) {
    next(err);
  }
})

router.post("/", async (req, res, next) => {
  try {
    const {name, email} = req.body
    const query = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";

    const {rows} = await client.query(query, [name, email]);

    res.status(201).send(rows[0]);
  } catch(err) {
    next(err);
  }
});

router.post("/:id", async (req, res, next) => {
  try {
    const {description, amount, tags} = req.body;
    //have to process tags to insert into table

    //post into transactions, tags, and tags_transactions

    const query = "INSERT INTO transactions (description, amount, userId) VALUES ($1, $2, $3) RETURNING *";
    const {rows} = await client.query(query, [description, amount, req.params.id])

    res.status(201).send(rows[0]); //rewrite to send back newly created task or redirect to task list for user
  } catch(err) {
    next(err);
  }
});

module.exports = router;
