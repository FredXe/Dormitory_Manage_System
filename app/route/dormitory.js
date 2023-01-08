const express = require("express");

const token = require("../middleware/token");
const dormitory = require("../model/dormitory");

const router = express.Router();

router.get("/", function (req, res) {
	res.redirect("/dormitory/list");
});

router.get("/list", function (req, res) {
	var privilege;
	var equipments;
	token.decode(req.cookies.token, _getEquipment);

	function _getEquipment(decode) {
		privilege = decode.privilege;
		dormitory.showEquipments(_getDormitory);
	}

	function _getDormitory(err, _equipment) {
		equipments = _equipment;
		dormitory.showDormitory(_render);

	}

	function _render(err, dormitories) {
		res.render("dormitory", { dormitories, privilege, equipments });
	}
})

router.route("/equipment")
	.get(function (req, res) {
		var privilege;
		var equipments;
		token.decode(req.cookies.token, _getEquipment);

		function _getEquipment(decode) {
			privilege = decode.privilege;
			dormitory.showProblemEquipment("%", _getDormitory);
		}

		function _getDormitory(err, _equipment) {
			equipments = _equipment;
			dormitory.showDormitory(_render);

		}

		function _render(err, dormitories) {
			res.render("dormitory", { dormitories, privilege, equipments });
		}
	})



module.exports = router;