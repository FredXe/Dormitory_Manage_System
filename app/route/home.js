const express = require("express");

const util = require("./util");
const token = require("../middleware/token");
const user = require("../model/user");

const router = express.Router();

router.get("/", function (req, res) {
	util.responseFile("./view/Student.html", 200, res);
});

module.exports = router;