const router = require("express").Router();
const client = require("../db");
const sqlQueries = require("../queries");

router.post("/login", async (req, res, next) => {
  try {
    const { findUserByEmail } = sqlQueries;
    const { email, password } = req.body;

    let user = await client.query(findUserByEmail, [email]);

    // pgp returns an array of objects, and if only finding one row, there will be one element as an object
    // if no row matches query, pgp returns an empty array
    if (!user.rows.length) {
      res.status(401).send("Wrong email or password");
    } else if (user.rows[0].password !== password) {
      res.status(401).send("Wrong email or password");
    } else {
      req.login(user, (err) => {
        if (err) {
          next(err);
        } else {
          res.json(user.rows[0]);
        }
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { postNewUser } = sqlQueries;
    const { name, password, email } = req.body;

    const user = await client.query(postNewUser, [name, email, password]);

    req.login(user, (err) => {
      if (err) {
        next(err);
      } else {
        res.json(user.rows[0]);
      }
    });
  } catch (err) {
    const errorDetail = err.detail;
    // error detail looks like: "Key (email)=(alex@email.com) already exists." when trying to sign up with duplicate email
    // need to somehow relate errorDetail to the if-statement below to handle a duplicate sign up
    if (errorDetail === "Key (email)=(alex@email.com) already exists.") {
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});

router.post("/logout", async (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send("user D-stroyed");
});

router.get("/me", (req, res) => {
  console.log("donde is user ka...", req.user);
  console.log("and this is req.session.passport", req.session.passport);
  res.json(req.user);
});

module.exports = router;
