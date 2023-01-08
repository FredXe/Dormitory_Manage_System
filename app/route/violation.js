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
		var account;
		if (["houseMaster", "admin"].includes(decode.privilege)) {
			account = "%";
		} else {
			account = decode.account;
		}
		violation.showRecord(account, function (err, records) {
			res.render("violation", { records });
		})
	}
})

router.post("/insert", function (req, res) {
	const record = req.body.record;

	token.decode(req.cookies.token, _insertRecord);

	function _insertRecord(decode) {
		violation.insertRecord(decode.account, record.boarder, record.type, function (err, rows) {
			res.redirect("/violation/list");
		});
	}
})


module.exports = router;