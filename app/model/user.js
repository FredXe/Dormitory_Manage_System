/**
 * Module control the TABLE `Users`
 */
const hash = require("bcrypt");
const Connections = require("./connections");
const Hash = require("./hash");

/**
 * Convert Rows into Object with JSON's 
 * static functions
 * @param {RawData} rows Rows input
 * @returns Object that `rows` expressed
 */
function decodeRows(rows) {
	return Object.values(JSON.parse(JSON.stringify(rows)));
}

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
			sex = 'N',
			eroll_year = 2019,
			userType = 'student',
			a_ID = 'NODEJS.D'
		}, callback) {

			// Check if usertype is valid
			userType = userType.toLowerCase();
			if (["student", "housemaster", "admin"].includes(userType) == false) {
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
		}
	}

	/**
	 * Login function
	 * @param {string} account UserID in Database
	 * @param {string} password Plain text password
	 * @param {(err, rows)} callback `rows` is filled
	 * with privilege if login success, `undefined`
	 * if no such user or the password doesn't match.
	 */
	static login({ account, password }, callback) {

		// SELECT the password and the privileges
		const query = `SELECT U.password, (CASE WHEN U.UserID IN (SELECT UserID FROM \`student\`) THEN 'student'
				WHEN U.UserID IN (SELECT UserID FROM \`houseMaster\`) THEN 'houseMaster'
				WHEN U.UserID IN (SELECT UserID FROM \`admin\`) THEN 'admin'
				ELSE 'Unknown' END) AS privilege FROM \`users\` AS U LEFT JOIN \`student\` AS S ON U.\`UserID\` = S.\`UserID\`
				WHERE U.\`UserID\`='${account}';`;

		/**
		 * Declare the query callbcak function
		 */
		function checkPasswd(err, rows) {
			if (err) {
				callback(err.message, rows);
				return;
			}

			rows = decodeRows(rows)[0];

			// Return if no target User
			if (rows == undefined) {
				callback(err, rows);
				return;
			}

			/**
			 * Hash the password and compare it with the DB's
			 * password. 
			 */
			Hash.checkPasswd(password, rows.password, function (err, result) {
				if (err) {
					callback(err.message, rows);
					return;
				}

				if (result == true) {
					callback(err, rows);
				} else {
					callback(err, undefined);
				}

			});
		}

		/**
		 * Execute the query
		 */
		Connections.admin.query(query, checkPasswd);

	}

}

module.exports = User;
