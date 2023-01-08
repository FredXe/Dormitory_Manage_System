const express = require("express");

const util = require("./util");
const token = require("../middleware/token");
const violation = require('../model/violation');

const router = express.Router();
var urlParser = util.urlParser;

router.get("/", function (req, res) {
	res.redirect("/board/list");
	// console.log('suc');
	// res.render('board' , comments);
});

router.get("/list", function (req, res) {
	token.decode(req.cookies.token, _selectRecord)

	function _selectRecord() {
		var account;
		if (["houseMaster", "admin"].includes(decode.privilege)) {
			account = "%";
		} else {
			account = decode.account;
		}
		violation.showRecord(account, function (err, records) {
			res.render("student", { records });
		})
	}
})

router.post("/insert")


module.exports = router;