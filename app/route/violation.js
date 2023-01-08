const express = require("express");

const util = require("./util");
const token = require("../middleware/token");
const violation = require('../model/violation');

const router = express.Router();
var urlParser = util.urlParser;

router.get("/", function (req, res) {
	res.redirect("/violation/list");
});

router.get("/list", function (req, res) {
	token.decode(req.cookies.token, _selectRecord)

	function _selectRecord(decode) {
		const privilege = decode.privilege;
		violation.showRecord("%", function (err, records) {
			console.log(records);
			res.render("violation", { records, privilege });
		})
	}
})

router.post("/insert", function (req, res) {
	const { boarder, type } = req.body;

	token.decode(req.cookies.token, _insertRecord);

	function _insertRecord(decode) {
		violation.insertRecord(decode.account, boarder, type, function (err, rows) {
			res.redirect("/violation/list");
		});
	}
})


module.exports = router;