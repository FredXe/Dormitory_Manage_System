const express = require("express");

const token = require("../middleware/token");
const application = require("../model/application");

const router = express.Router();

// Router of `/user`
router.get("/", function (req, res) {
	res.redirect("/application/list");
})

router.get("/list", function (req, res) {
	application.showApplicationInfo("%", function (err, applicaitons) {
		console.log(applicaitons);

	});
	res.render("application", { applicaitons });
})

router.post("/request", function (req, res) {
	token.decode(req.cookies.token, _requestApp);

	function _requestApp(decode) {
		const account = decode.account;
		application.requestForApplication(account, 2023, _redirect);
	}

	function _redirect(err, rows) {
		res.redirect("/application/list");
	}
})

router.route("/approve")
	.get(function (req, res) {
		application.showNotAppliedYet(_func);

		function _func(err, rows) {
			console.log(rows);
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

			application.apply(account, roomNum, dormitory, admin, _redirect);
		}

		function _redirect(err, rows) {
			res.redirect("/application/list");
		}
	})

// router.get("", function (req, res){ })

module.exports = router;