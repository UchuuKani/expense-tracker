const router = require("express").Router();
const client = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const query = "SELECT dogs.* FROM dogs";
    const { rows } = await client.query(query);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const query = "SELECT dogs.* FROM dogs WHERE dogs.id = $1";
    const { rows } = await client.query(query, [req.params.id]);

    if (!rows.length) {
      const new404 = new Error("Page not found");
      new404.status = 404;
      throw new404;
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { ownerid, name, breed, age } = req.body;
    const query =
      "INSERT INTO dogs (ownerid, name, breed, age) VALUES ($1, $2, $3, $4) RETURNING *";

    const { rows } = await client.query(query, [ownerid, name, breed, age]);

    res.status(201).send(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
