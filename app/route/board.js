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


// 顯示布告欄
router.get("/list", function (req, res) {
	board.selectPost(function (err, posts) {
		console.log(posts);
		res.render('board', { posts });
	})

})

router.route("/post")
	// 顯示新增公告的介面
	.get(function (req, res) {
		res.render('chat');
	})

	// 提交新增內容之後回到布告爛
	.post(urlParser, function (req, res) {
		post = req.body;
		board.post(post.ID, post.title, post.content, (err, rows) => {
			res.redirect('/board/list');
		});

	});

router.get("/:id", function (req, res) {
	const id = req.params.id;
	board.selectCommentByBID(id, function (err, comments) {
		res.send(comments);
	});
})

module.exports = router;