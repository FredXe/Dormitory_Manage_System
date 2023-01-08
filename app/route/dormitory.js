const express = require("express");

const util = require("./util");
const dormitory = require("../model/dormitory");

const router = express.Router();

router.get("/", function (req, res) {
	res.redirect("/list");
});

router.get("/list", function (req, res) {
	dormitory.showDormitory(function (err, dormitories) {
		res.render("student", { dormitories });
	});
})



module.exports = router;