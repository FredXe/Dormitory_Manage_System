/**
 * Module control the TABLE `Users`
 */
const { hash } = require("bcrypt");
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

function getPasswd(UserID, callback) {
	const queryString = `SELECT password FROM users WHERE UserID = '${UserID}'`;

	// Function that insert User to specific User Type
	Connections.admin.query(queryString, callback);
}

class User {
	/**
	 * Initialize the connections to Database
	 */
	constructor() {

		this.Admin = {

			/**
			 * Insert the Data into TABLE `Users`
			 * @param {*} UserID Account (required)
			 * @param {*} Password (required)
			 * @returns Async function, return value by callback
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

						// Insert 
						const queryString = `INSERT INTO \`${userType}\`
										VALUES ('${UserID}', '${a_ID}'); `;

						// Send SQL query to DB
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
		 * @returns Privilege of the user,
		 * Empty array if the parameter doesn't matches the user
		 * Return by callback.
		 */
		this.login = function ({ account, password }, callback) {

			// function hashCB(err, hash) {
			// 	if (err) {
			// 		callback(err.message);
			// 		return;
			// 	}
			// 	console.log(hash);

			/**
			 * SELECT the UserID which matches the input,
			 * using switch to return the user's previlege
			 * if the user is inside the table. 
			 */
			const queryString = `SELECT U.password, (CASE WHEN U.UserID IN (SELECT UserID FROM \`student\`) THEN 'student'
				WHEN U.UserID IN (SELECT UserID FROM \`houseMaster\`) THEN 'houseMaster'
				WHEN U.UserID IN (SELECT UserID FROM \`admin\`) THEN 'admin'
				ELSE 'Unknown' END) AS privilege, a_ID FROM \`users\` AS U LEFT JOIN \`student\` AS S ON U.\`UserID\` = S.\`UserID\`
				WHERE U.\`UserID\`='${account}';`;

			// Send the query with Admin account
			Connections.admin.query(queryString, (err, rows) => {
				if (err) {
					callback(err.message, rows);
					return;
				}
				rows = decodeRows(rows)[0];

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
}

module.exports = User;
