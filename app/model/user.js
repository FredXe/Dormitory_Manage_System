/**
 * Module control the TABLE `Users`
 */
const Connections = require("./connections");

/**
 * Convert Rows into Object with JSON's 
 * static functions
 * @param {*} rows Rows input
 * @returns Object that `rows` expressed
 */
function decodeRows(rows) {
	return Object.values(JSON.parse(JSON.stringify(rows)));
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
				userType = 'Student',
				a_ID = 'NODEJSA_ID'
			}, callback) {

				// Check if usertype is valid
				userType = userType.toLowerCase();
				if (["student", "housemaster", "admin"].includes(userType) == false) {
					console.error("userType invalid");
				}

				// Insert data into `Users`
				const queryString = `INSERT INTO \`Users\` 
					VALUES ('${UserID}', '${Password}', '${name}', '${email}', 
					'${phnumber}', '${sex}', ${eroll_year}); `;

				// Function that insert User to specific User Type
				function insertUserType(err, rows) {
					if (err) {
						callback(err.message, rows);
						return;
					}

					// Match the userType to the Table's name
					userType = userType.charAt(0).toUpperCase() + userType.slice(1);

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
			/**
			 * SELECT the UserID which matches the input,
			 * using switch to return the user's previlege
			 * if the user is inside the table. 
			 */
			const queryString = `SELECT (CASE WHEN U.UserID IN (SELECT UserID FROM \`Student\`) THEN 'Student'
			WHEN U.UserID IN (SELECT UserID FROM \`HouseMaster\`) THEN 'HouseMaster'
			WHEN U.UserID IN (SELECT UserID FROM \`Admin\`) THEN 'Admin'
			ELSE 'Unknown' END) AS privilege, a_ID FROM \`Users\` AS U LEFT JOIN \`Student\` AS S ON U.\`UserID\` = S.\`UserID\`
			WHERE U.\`UserID\`='${account}' AND \`Password\`='${password}';`;

			// Send the query with Admin account
			Connections.admin.query(queryString, (err, rows) => {
				if (err) {
					callback(err.message, rows);
					return;
				}
				callback(err, decodeRows(rows));
			});
		}

	}
}

module.exports = User;
