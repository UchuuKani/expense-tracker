const express = require("express");
// const bodyParser = require('body-parser');
// const pino = require("express-pino-logger")(); // no longer using pino for logging as the script is broken: "server"
const morgan = require("morgan");
const app = express();
const session = require("express-session");
const passport = require("passport");
const dbClient = require("./db");
// import the connect-pg-simple library to use for session store
const pgSession = require("connect-pg-simple")(session);

passport.serializeUser((user, done) => {
  done(null, user.rows[0].id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await dbClient.query(
      "SELECT * FROM users WHERE users.id = $1",
      [id]
    );
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));
// creates the session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "budgeting more things",
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
      conString:
        "postgres://" +
        process.env.DB_USER +
        ":" +
        process.env.DB_PASSWORD +
        "@" +
        process.env.DB_HOST +
        "/" +
        process.env.DB_DATABASE,
    }), // per connect-pg-simple docs
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days per connect-pg-simple docs
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/api/greeting", (req, res) => {
  const name = req.query.name || "World";
  console.log(
    "server side, req.session",
    "postgres://" +
      process.env.DB_USER +
      ":" +
      process.env.DB_PASSWORD +
      "@" +
      process.env.DB_HOST +
      "/" +
      process.env.DB_DATABASE
  );
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.use("/auth", require("./auth"));
app.use("/api", require("./api"));

app.use("*", (req, res, next) => {
  res.status(404).send("Nothing here");
});

app.use((err, req, res, next) => {
  if (err.status === 404) {
    console.error(err);

    res.status(404).send("You fugged up my dude: 404");
  } else {
    console.error(err, err.message);
    res.status(500).send("server fugged: 500");
  }
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
