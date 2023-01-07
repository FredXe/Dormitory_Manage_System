const express = require("express");

const util = require("./util");

const router = express.Router();
var urlParser = util.urlParser;

router.get("/", function (req, res) {
	res.redirect("/board/list");
});

router.get("/list", function (req, res) {
	util.responseHtml("./view/boarder.html", 200, res);
})

module.exports = router;