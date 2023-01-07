const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "app/model/.env" });

const secret = process.env.SECRET;
// Expires in 30 min
const EXPIRES_IN = 30 * 60;

function sign(payload, callback) {
	jwt.sign(payload, secret, { expiresIn: EXPIRES_IN }, function (err, token) {
		if (err) {
			console.error(err);
			return;
		}
		callback(token);
	});
}


function verifyToken(token, callback) {
	jwt.verify(token, secret, function (err, decode) {
		if (err) {
			console.error(err);
			callback(undefined);
			return;
		}
		callback(decode);
	});
}

function verify(req, res, next) {
	console.log(req.url);


	const _token = req.cookies.token;

	console.log(_token);
	if (!_token) {
		res.redirect("/login");
		return;
	}

	verifyToken(_token, function (decode) {
		if (decode) {
			console.log("exec next()");
			next();
			return;
		}

		res.redirect("/login");
		return;
	});

}

module.exports = { verify, sign, EXPIRES_IN };