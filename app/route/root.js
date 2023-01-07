const express = require("express");

const token = require("../middleware/token");
const util = require("./util");
const user = require("../model/user");

const router = express.Router();
const MAX_AGE = token.EXPIRES_IN * 1000;
var urlParser = util.urlParser;

router.route("/login")
	.get(function (req, res) {
		util.responseFile("./view/login.html", 200, res);
	})
	.post(urlParser, function (req, res) {
		// Parse the `req`.`body`
		const userInfo = req.body;

		user.login(userInfo, _checkAccountExist);

		function _checkAccountExist(ret) {
			if (!ret) {
				res.send("Failed login");
				res.end();
				return;
			};

			token.sign(ret, _sendToken);
		}

		function _sendToken(token) {
			res.cookie("token", token, { maxAge: MAX_AGE, httpOnly: true });
			res.redirect("/home");
			return;
		}
	});


module.exports = router;