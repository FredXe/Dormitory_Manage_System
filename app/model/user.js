/**
 * Module control the TABLE `users`
 */
const Connections = require("./connections");
const Hash = require("./hash");
const Util = require("./util");

/**
 * SELECT password of specific user
 * @param {string} UserID 
 * @param {(err, rows)} callback 
 */
function getPasswd(UserID, callback) {
	const query = `SELECT password FROM users WHERE UserID = '${UserID}'`;

	// Function that insert User to specific User Type
	Connections.admin.query(query, callback);
}

/**
 * Public class with static method
 */
class User {
	static Admin = {
		/**
		 * Insert the Data into TABLE `Users`
		 * @param {string} UserID Account (required)
		 * @param {string} Password Plain text (required)
		 * @param {(err, rows)} callback 
		 */
		regist: function ({
			UserID,
			Password,
			name = 'Nodejs',
			email = 'default@node.js',
			phnumber = '0912345678',
			sex = 'U',
			eroll_year = 2019,
			userType = 'student',
			a_ID = 'NODEJS.D'
		}, callback) {

			// Check if usertype is valid
			if (["student", "houseMaster", "admin"].includes(userType) == false) {
				console.error("userType invalid");
				return;
			}

			/**
			 * Declare query callback function
			 */
			// Insert User to specific User Type
			function insertUserType(err, rows) {
				if (err) {
					callback(err.message, rows);
					return;
				}

				// INSERT User into specific usertype TABLE
				const query = `INSERT INTO \`${userType}\`
									VALUES ('${UserID}'); `;

				Connections.admin.query(query, (err, rows) => {
					if (err) {
						callback(err.message, rows);
						return;
					}
					callback(err, rows);
				});
			}

			/**
			 * Execute the function
			 */
			Hash.hashPasswd(Password, function (err, hash) {
				if (err) {
					callback(err.message);
					return;
				}
				// Insert data into `Users`
				const query = `INSERT INTO \`users\` (UserID, Password, name, email, phnumber, sex, eroll_year)
					VALUES ('${UserID}', '${hash}', '${name}', '${email}', 
					'${phnumber}', '${sex}', ${eroll_year}); `;

				// Send SQL query to DB
				Connections.admin.query(query, insertUserType);
			});

		},

		/**
		 * Delete the User
		 * NOTE: this function will not check the
		 * privilege or password.
		 * @param {string} account 
		 * @param {(err, rows)} callback `rows.affectRows` == 0
		 * if no account DELETED
		 */
		delete: function (account, callback) {
			const query = `DELETE FROM users WHERE UserID='${account}'`;

			Connections.admin.query(query, callback);
		},

		showUsers: function (callback) {
			const query = `SELECT *, (CASE WHEN UserID IN (SELECT UserID FROM \`student\`) THEN 'student'
			WHEN UserID IN (SELECT UserID FROM \`houseMaster\`) THEN 'houseMaster'
			WHEN UserID IN (SELECT UserID FROM \`admin\`) THEN 'admin'
			ELSE 'Unknown' END) AS privilege FROM \`users\`;`;

			Connections.admin.query(query, function (err, rows) {
				if (err) {
					console.error(err);
					return;
				}
				rows = Util.decodeRows(rows);
				callback(err, rows);
			});
		}
	}

	/**
	 * Login function
	 * @param {string} account UserID to login
	 * @param {string} password Plain text password
	 * @param {(ret)} callback `ret` is filled
	 * with privilege and UserID if login success,
	 * `undefined` if no such user or the password
	 * doesn't match.
	 */
	static login({ account, password }, callback) {
		// Get the account info first
		this.getAccountInfo(account, checkPasswd);

		// Check the input password is matching the DB's one.
		function checkPasswd(err, rows) {
			if (err) {
				console.error(err, rows);
				return;
			}

			/**
			 * Compare the DB's password with input. 
			 */
			Hash.checkPasswd(password, rows.password, function (err, result) {
				if (err) {
					console.error(err, rows);
					return;
				}

				if (result == true) {
					const privilege = rows.privilege;
					callback({ account, privilege });
				} else {
					callback(undefined);
				}

			});
		}


	}

	/**
	 * Get the info of the Account
	 * @param {string} account Account to search
	 * @param {(err, {password, privilege})} callback 
	 * The password is hashed. `rows` == `undefined`
	 * if no such user.
	 */
	static getAccountInfo(account, callback) {
		// SELECT the password and the privileges
		const query = `SELECT U.password, (CASE WHEN U.UserID IN (SELECT UserID FROM \`student\`) THEN 'student'
			WHEN U.UserID IN (SELECT UserID FROM \`houseMaster\`) THEN 'houseMaster'
			WHEN U.UserID IN (SELECT UserID FROM \`admin\`) THEN 'admin'
			ELSE 'Unknown' END) AS privilege FROM \`users\` AS U LEFT JOIN \`student\` AS S ON U.\`UserID\` = S.\`UserID\`
			WHERE U.\`UserID\`='${account}';`

		Connections.admin.query(query, function (err, rows) {
			if (err) {
				callback(err, undefined);
				return;
			}

			rows = Util.decodeRows(rows)[0];

			if (rows == undefined) {
				callback("getAccountInfo(): no target user", rows);
				return;
			}

			callback(err, rows);
		});
	}
}

module.exports = User;
