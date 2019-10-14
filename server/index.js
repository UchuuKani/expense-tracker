const express = require('express');
// const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.use("/api", require("./api"));

app.use("*", (req, res, next) => {
  res.status(404).send("Nothing here");
})

app.use((err, req, res, next) => {
  if (err.status === 404) {
    console.error(err);
    res.status(404).send("You fugged up my dude");
  } else {
    console.error(err);
    res.send("Server fugged");
  }
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);



