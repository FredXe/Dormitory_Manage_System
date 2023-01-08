const express = require("express");

const token = require("../middleware/token");
const application = require("../model/application");
const dormitory = require("../model/dormitory");

const router = express.Router();

// Router of `/user`
router.get("/", function (req, res) {
	res.redirect("/application/list");
})

router.get("/list", function (req, res) {
	token.decode(req.cookies.token, _redirect);

	function _redirect(decode) {
		if (decode.privilege == "admin") {
			console.log(decode);
			res.redirect("/application/approve");
			return;
		}
		application.showApplicationInfo(decode.account, _getDormitoryInfo);
	}

	function _getDormitoryInfo(err, applications) {
		dormitory.showDormitory(function (err, dormitories) {
			res.render("application", { applications, dormitories });
		});
	}
})

router.route("/request")
	.get(function (req, res) {
		dormitory.showDormitory(function (err, dormitories) {
			console.log(dormitories);
			res.render("application", { dormitories });
		});
	})
	.post(function (req, res) {
		console.log(req.body);
		const dormitory = req.body.dormitory;
		token.decode(req.cookies.token, _requestApp);

		function _requestApp(decode) {
			const account = decode.account;
			application.requestForApplication(account, 2023, dormitory, _redirect);
		}

		function _redirect(err, rows) {
			console.log(err, rows);
			res.redirect("/application/list");
		}
	})

router.route("/approve")
	.get(function (req, res) {
		application.showNotAppliedYet(_render);

		function _render(err, applications) {
			res.render("approve", { applications });
		}
	})
	.post(function (req, res) {
		const { roomNum, dormitory } = req.body.room;
		const account = req.body.account;

		token.decode(req.cookies.token, _approve);


		function _approve(decode) {
			if (decode.privilege != "admin") {
				return;
			}
			const admin = decode.admin;

			application.apply(account, admin, _redirect);
		}

		function _redirect(err, rows) {
			res.redirect("/application/list");
		}
	})

// router.get("", function (req, res){ })

module.exports = router;