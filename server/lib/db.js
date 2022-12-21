const mysql = require("mysql");

// Connection that log in with 'admin'
const adminConnection = mysql.createConnection({
	host: 'tupao.one',
	user: 'admin',
	password: 'a1095500',
	database: 'dormitory'
});

const Db = {
	/**
	 * Initialize the connections to Database
	 */
	init: () => {
		adminConnection.connect();
	},

	Admin: {
		/**
		 * Insert the Data into TABLE `Users`
		 * NOTE: UserID and Password is required.
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

			/**
			 * Fill the SQL query with parameters
			 */

			// SQL query send to DB
			const sqlString = `INSERT INTO \`Users\` ` +
				`VALUES ('${UserID}', '${Password}', '${name}', '${email}'` +
				`, '${phnumber}', '${sex}', ${eroll_year}, '${privilege}'); `;

			// Send the query with Admin account
			adminConnection.query(sqlString, (err, result, field) => {
				if (err) {
					console.error("", err.sqlMessage);
				}
				console.log(result);
			})
		}
	}
}

module.exports = Db;
