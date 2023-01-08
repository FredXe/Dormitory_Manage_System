const express = require("express");

const util = require("./util");
const board = require('../model/board');
const token = require("../middleware/token");
const { compareSync } = require("bcrypt");

const router = express.Router();
var urlParser = util.urlParser;



router.get("/", function (req, res) {
	res.redirect("/board/list");
	// console.log('suc');
	// res.render('board' , comments);
});


// 顯示布告欄
router.get("/list", function (req, res) {
	board.selectPost("%", function (err, posts) {
		console.log(posts);
		res.render('board', { posts });
	})

})

router.route("/post")
	// 顯示新增公告的介面
	.get(function (req, res) {
		res.render('post');
	})

	// 提交新增內容之後回到布告欄
	.post(function (req, res) {
		token.decode(req.cookies.token, function (decode) {

			const account = decode.account;
			const post = req.body;
			console.log(post);
			board.post(account, post.title, post.content, (err, rows) => {
				res.redirect('/board/list');
			});
		});


	});

router.route("/:id")
	.get(function (req, res) {
		const id = req.params.id;
		board.selectCommentByBID(id, function (err, comments) {
			board.selectPost(id, function (err, post) {
				post = post[0];
				console.log(post);
				res.render("article", { comments, post });
			});
		});
	})
	.post(function (req, res) {
		const id = req.params.id;
		const comment = req.body.comment;
		token.decode(req.cookies.token, _comment);

		function _comment(decode) {
			const account = decode.account;
			board.comment(account, id, comment, _redirectToPost);
		}

		function _redirectToPost(err, rows) {
			if (err) {

			}
			res.redirect(`/board/${id}`);
		}
	})

module.exports = router;