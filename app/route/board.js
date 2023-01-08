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

var comments;

// 顯示布告欄
router.get("/list", function (req, res) {
	board.selectPost(function(err , comments){
		res.render('board' , {comments});
	})
	
})

// 顯示新增公告的介面
router.post('/list/post' , function (req , res) {
	res.render('chat');
})

// 提交新增內容之後回到布告爛
router.post('/list/post/update' , function(req , res){
	comments = req.query;
	board.post(comments['ID'] , comments['title'] , comments['message'] , (err , rows) => {
		res.redirect('/board/list');
	});
	
});

module.exports = router;