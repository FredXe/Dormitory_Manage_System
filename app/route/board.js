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
<<<<<<< HEAD
	util.responseHtml("./view/boarder.html", 200, res);
=======
	// util.responseHtml('./views/board.html' , 200 , res);
	board.selectPost(function(err , rows){
		comments = rows;
	})
	res.render('board' , comments);
>>>>>>> e7a948c377c234adfb599e45322dabcb4a0b0ae6
})

module.exports = router;