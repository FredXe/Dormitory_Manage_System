const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "app/model/.env" });

const secret = process.env.SECRET;
// Expires in 30 min
const EXPIRES_IN = 30 * 60;
// const EXPIRES_IN = 5;
const MAX_AGE = EXPIRES_IN * 1000;

/**
 * Sign the token.
 * @param {*} payload The token's paylaod
 * @param {(token)} callback 
 */
function sign(payload, callback) {
	jwt.sign(payload, secret, { expiresIn: EXPIRES_IN }, function (err, token) {
		if (err) {
			console.error(err);
			return;
		}
		callback(token);
	});
}

/**
 * Verify if the token is valid and decode it.
 * @param {string} token Token to be verify
 * @param {(decode)} callback 
 * `decode` = `undefined` if verification is denied.
 */
function decode(token, callback) {
	jwt.verify(token, secret, function (err, decode) {
		if (err) {
			console.error(err);
			callback(undefined);
			return;
		}
		callback(decode);
	});
}

/**
 * Middleware of verify the token.
 * @param {*} req `req` of METHOD.
 * @param {*} res `res` of METHOD
 * @param {*} next next handler.
 * @returns 
 */
function verify(req, res, next) {
	const _token = req.cookies.token;
	const _url = req.cookies.url;

	console.log(req.method, req.url);
	// Goto `next` if it's going to `/login`
	if (req.url == "/login") {
		next();
		return;
	}

	// Goto login if there's no token in `req`.
	if (!_token) {
		// Set the last Url
		res.cookie("lastUrl", req.url, { maxAge: MAX_AGE * 5, httpOnly: true });
		res.redirect("/login");
		return;
	}


	decode(_token, function (decode) {
		// Go `next()` if decode isn't empty.
		if (decode) {
			next();
			return;
		}

		// Goto login if the verification is denied.
		res.cookie("lastUrl", req.url, { maxAge: MAX_AGE * 5, httpOnly: true });
		res.redirect("/login");
		return;
	});

}



module.exports = { verify, decode, sign, EXPIRES_IN };