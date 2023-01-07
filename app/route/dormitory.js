const express = require("express");

const util = require("./util");
const dormitory = require("../model/dormitory");

const router = express.Router();
var urlParser = util.urlParser;

router.get("/", function (req, res) {
	// res.redirect("");
});

router.get("/list", function (req, res) {
	dormitory.showDormitory(function (err, rows) {
		res.send(rows);
		console.log(rows);
	});
})



module.exports = router;