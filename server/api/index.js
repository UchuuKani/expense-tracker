const router = require("express").Router();

router.use("/users", require("./usersRouter"));
router.use("/dogs", require("./dogsRouter"));

module.exports = router;



