const express = require("express");

const token = require("../middleware/token");

const MAX_AGE = token.EXPIRES_IN * 1000;
const router = express.Router();

router.get("/", function (req, res) {
	res.send("user root");
	res.end();
})

module.exports = router;