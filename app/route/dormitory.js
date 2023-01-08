const express = require("express");

const util = require("./util");
const dormitory = require("../model/dormitory");

const router = express.Router();
var urlParser = util.urlParser;

var ejs = { "dormitories": [] };

router.get("/", function (req, res) {
	res.redirect("/list");
});

router.get("/list", function (req, res) {
	dormitory.showDormitory(function (err, dormitories) {
		ejs.dormitories = dormitories
		res.render("student", ejs);
	});
})



module.exports = router;