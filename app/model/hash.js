const bcrypt = require("bcrypt");

const saltRounds = 10;

class Hash {
	static hashPasswd(password, callback) {
		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) {
				console.error(err);
			}
			bcrypt.hash(password, salt, function (err, hash) {
				if (err) {
					console.error(err);
				}
				callback(err, hash);
			})
		});
	}

	static checkPasswd(password, hash, callback) {
		bcrypt.compare(password, hash, callback);
	}

}

module.exports = Hash;