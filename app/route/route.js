const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
// const qs = require('querystring');

const app = require("../app");
const util = require("./util");
const token = require("../middleware/token");
const root = require("./root");
const user = require("./user");
const home = require("./home");

var urlencodedParser = bodyParser.urlencoded({ extended: false });


// Configure the express application.
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(root);
app.use("/user", user);
app.use("/home", home);
app.use(token.verify);

app.get('/', (req, res) => {
	res.redirect("/home");

});

app.get('/api', function (req, res) {
	console.log(req.cookies);
	if (req.cookies.rememberme) {
		res.redirect("/home");
		res.status(304);
		return;
	}
	res.cookie("rememberme", "NODE test cookie", { maxAge: 10000 });
	res.status(200).json("welcome to API!");
})

// app.post('/login', urlencodedParser, function (req, res) {
// 	// Parse the `req`.`body`
// 	const userInfo = req.body;

// 	User.login(userInfo, _checkAccountExist);

// 	function _checkAccountExist(ret) {
// 		if (!ret) {
// 			res.json;
// 			return;
// 		};

// 		Token.sign(ret, _sendToken);
// 	}

// 	function _sendToken(token) {
// 		res.cookie("token", token, { maxAge: MAX_AGE, httpOnly: true });
// 		res.redirect("/home");

// 	}
// });


