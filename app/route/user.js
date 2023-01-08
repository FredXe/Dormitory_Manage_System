const express = require("express");

const token = require("../middleware/token");

const router = express.Router();

// Router of `/user`
router.get("/", function (req, res) {
	res.send("user root");
	res.end();
})

module.exports = router;