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

var comments = { 'comments': [] };

router.get("/list", function (req, res) {
	board.selectPost(function (err, posts) {
		console.log(posts);
		res.render("board", { posts });
	})
})

router.post("/post", function (req, res) {

})

router.get("/:id", function (req, res) {
	const id = req.params.id;
	board.selectCommentByBID(id, function (err, comments) {
		res.send(comments);
	});
})


module.exports = router;