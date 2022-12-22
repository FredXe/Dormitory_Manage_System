const mysql = require("mysql");
const { json } = require("stream/consumers");

// Connection that log in with 'admin'
const adminConnection = mysql.createConnection({
	host: 'tupao.one',
	user: 'admin',
	password: 'a1095500',
	database: 'dormitory'
});

/**
 * Convert Rows into Object with JSON's 
 * static functions
 * @param {*} rows Rows input
 * @returns Object that `rows` expressed
 */
function decodeRows(rows) {
	return Object.values(JSON.parse(JSON.stringify(rows)));
}

class Db {
	/**
	 * Initialize the connections to Database
	 */
	constructor() {
		adminConnection.connect();

		this.Admin = {
			/**
			 * Insert the Data into TABLE `Users`
			 * @param {*} UserID Required
			 * @param {*} Password Required
			 */
			insertUsers: ({
				UserID,
				Password,
				name = 'test',
				email = 'default@example.host',
				phnumber = '0912345678',
				sex = 'N',
				eroll_year = 2019,
				privilege = 'G' }) => {

				// SQL query send to DB
				const queryString = `INSERT INTO \`Users\`
					VALUES ('${UserID}', '${Password}', '${name}', '${email}',
					'${phnumber}', '${sex}', ${eroll_year}, '${privilege}'); `;

				// Send the query with Admin account
				adminConnection.query(queryString, (err, rows, field) => {
					if (err) {
						console.error(err.sqlMessage);
					}
					console.log(rows);
				});
			}
		}

		/**
		 * Check if the account is inside the
		 * Database.
		 * @param {*} account UserID in Database
		 */
		this.login = (account, password, callback) => {

			// SQL query send to DB
			const queryString = `SELECT \`UserID\` \`account\`, 
				\`privilege\` FROM \`Users\` 
				WHERE \`UserID\`='${account}' AND \`Password\`='${password}';`;

			// Send the query with Admin account
			adminConnection.query(queryString, (err, rows, field) => {
				if (err) {
					console.error(err.sqlMessage);
				}
				console.log(decodeRows(rows));
			});
		}

		this.close = () => {
			adminConnection.end();
		}

	}
}

module.exports = Db;
