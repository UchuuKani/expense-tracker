const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");

app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", require("./api"));


app.use((err, req, res, next) => {
  if (err.status === 404) {
    console.error(err);
    res.status(404).send("You fugged up my dude");
  } else {
    console.error(err);
    res.send("Server fugged");
  }
});

const PORT = 3030;

app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});



