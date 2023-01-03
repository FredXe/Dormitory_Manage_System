/**
 * Module control the TABLE `Users`
 */
const hash = require("bcrypt");
const Connections = require("./connections");
const Hash = require("./hash");

/**
 * Convert Rows into Object with JSON's 
 * static functions
 * @param {*} rows Rows input
 * @returns Object that `rows` expressed
 */
function decodeRows(rows) {
	return Object.values(JSON.parse(JSON.stringify(rows)));
}

/**
 * SELECT password of specific user
 * @param {*} UserID 
 * @param {*} callback function (`err`, `rows`)
 */
function getPasswd(UserID, callback) {
	const queryString = `SELECT password FROM users WHERE UserID = '${UserID}'`;

	// Function that insert User to specific User Type
	Connections.admin.query(queryString, callback);
}

class User {

	static Admin = {
		/**
		 * Insert the Data into TABLE `Users`
		 * @param {*} UserID Account (required)
		 * @param {*} Password (required)
		 * @returns Error message is filled on error
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

			Hash.hashPasswd(Password, function (err, hash) {
				if (err) {
					callback(err.message);
					return;
				}

				// Insert data into `Users`
				const queryString = `INSERT INTO \`users\` (UserID, Password, name, email, phnumber, sex, eroll_year)
						VALUES ('${UserID}', '${hash}', '${name}', '${email}', 
						'${phnumber}', '${sex}', ${eroll_year}); `;

				// Function that insert User to specific User Type
				function insertUserType(err, rows) {
					if (err) {
						callback(err.message, rows);
						return;
					}

					// INSERT User into specific usertype TABLE
					const queryString = `INSERT INTO \`${userType}\`
										VALUES ('${UserID}'); `;

					Connections.admin.query(queryString, (err, rows) => {
						if (err) {
							callback(err.message, rows);
							return;
						}
						callback(err, rows);
					});
				}

				// Send SQL query to DB
				Connections.admin.query(queryString, insertUserType);
			});


		}
	}

	/**
	 * Check if the account is inside the
	 * Database.
	 * @param {*} account UserID in Database
	 * @param {*} password Plain text password
	 * @returns `undefined` if no such user or
	 * password doesn't match
	 */
	static login({ account, password }, callback) {

		/**
		 * SELECT the UserID which matches the input,
		 * using switch to return the user's previlege
		 * if the user is inside the table. 
		 */
		const queryString = `SELECT U.password, (CASE WHEN U.UserID IN (SELECT UserID FROM \`student\`) THEN 'student'
				WHEN U.UserID IN (SELECT UserID FROM \`houseMaster\`) THEN 'houseMaster'
				WHEN U.UserID IN (SELECT UserID FROM \`admin\`) THEN 'admin'
				ELSE 'Unknown' END) AS privilege FROM \`users\` AS U LEFT JOIN \`student\` AS S ON U.\`UserID\` = S.\`UserID\`
				WHERE U.\`UserID\`='${account}';`;

		// SELECT the password and the privileges and  
		Connections.admin.query(queryString, function (err, rows) {
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
		});

	}

}

module.exports = User;
