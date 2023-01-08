const express = require("express");

const token = require("../middleware/token");
const util = require("./util");
const user = require("../model/user");

const router = express.Router();
const MAX_AGE = token.MAX_AGE;

// alias `/`=`/home`
router.get('/', function (req, res) {
	res.redirect("/board/list");
});

// Router of `/home`
router.get("/home", function (req, res) {
	res.redirect("/board/list");
});

// Router of `/login`
router.route("/login")
	.get(function (req, res) {
		util.responseHtml("./views/login.html", 200, res);
	})
	.post(function (req, res) {
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

			const lastUrl = req.cookies.lastUrl;
			console.log(lastUrl);
			if (!lastUrl) {
				return res.redirect("/home");
			} else {
				return res.redirect(lastUrl);
			}
		}
	});


module.exports = router;