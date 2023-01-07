const express = require("express");

const util = require("./util");
const board = require('../model/board');

const router = express.Router();
var urlParser = util.urlParser;



router.get("/", function (req, res) {
	res.redirect("/board/list");
	// console.log('suc');
	// res.render('board' , comments);
});

var comments = {'comments' : []};

router.get("/list", function (req, res) {
	// util.responseHtml('./views/board.html' , 200 , res);
	board.selectPost(function(err , rows){
		comments = rows;
	})
	res.render('board' , comments);
})

module.exports = router;