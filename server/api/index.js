const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/tags", require("./tags"));
router.use("/transactions", require("./transactions"));

module.exports = router;
