const express = require("express");

const token = require("../middleware/token");
const dormitory = require("../model/dormitory");

const router = express.Router();

router.get("/", function (req, res) {
	res.redirect("/dormitory/list");
});

router.get("/list", function (req, res) {
	token.decode(req.cookies.token, _render);

	function _render(decode) {
		console.log(decode);
		dormitory.showDormitory(function (err, dormitories) {
			const privilege = decode.privilege;
			res.render("dormitory", { dormitories, privilege });
		});
	}
})



module.exports = router;