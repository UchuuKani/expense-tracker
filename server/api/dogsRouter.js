const router = require("express").Router();
const client = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const query = "SELECT dogs.* FROM dogs";
    const data = await client.query(query);

    res.json(data.rows);
  } catch(err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const query = "SELECT dogs.* FROM dogs WHERE dogs.id = $1";
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

router.post("/", (req, res, next) => {
  console.log("req.body is alive", req.body);

  res.sendStatus(201);
});

module.exports = router;
