const router = require("express").Router();
const client = require("../db");

router.get("/", async (req, res, next) => {
  try {
    // const query = "SELECT users.*, dogs.name AS dogName, dogs.breed, dogs.age FROM users LEFT JOIN dogs ON users.id = dogs.ownerId";

    const query = "SELECT users.*, pets FROM users LEFT JOIN (SELECT dogs.*) AS pets ON users.id = pets.ownerId";


    const data = await client.query(query);

    res.json(data.rows);
  } catch(err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const query = "SELECT users.*, dogs.* AS dogs FROM users JOIN dogs ON users.id = dogs.ownerId where users.id = $1";
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
