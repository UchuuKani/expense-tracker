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
    const data = await client.query(query, [req.params.id]);

    if (!data.rows.length) {
      const new404 = new Error("Page not found");
      new404.status = 404;
      throw new404;
    }

    res.json(data.rows[0]);
  } catch(err) {
    next(err);
  }
});

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

module.exports = router;
