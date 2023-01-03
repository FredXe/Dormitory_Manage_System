const Connections = require("./connections");

class Board {
	/**
	 * Post an article on bulletinBoard.
	 * @param {string} account The author.
	 * @param {string} title 
	 * @param {string} text The post's content
	 * @param {(err, rows)} callback `rows.affectedRows` == 1
	 * if success. `err` = "Account's permission denied" if
	 * the account has no privilege.
	 * NOTE: Only a user with privilege higher than
	 * houseMaster can post an article.
	 */
	static post(account, title, text, callback) {

		// INSERT a row to `bulletinBoard`
		const query = `INSERT INTO bulletinBoard (title, b_text) VALUE
		(IF ((SELECT UserID FROM houseMaster WHERE UserID='${account}' UNION
		SELECT UserID FROM admin WHERE UserID='${account}')='${account}', '${title}', NULL), '${text}');`;

		/**
		 * Declare the callback function of 
		 * inserting a row into bulletinBoard
		 */
		function insertManage_HB(err, rows) {
			if (err) {
				/**
				 * If it has no privilege, the title will be filled with
				 * `NULL`, and abort with constraint `NOT NULL`.
				 */
				if (err.sqlMessage == "Column 'title' cannot be null") {
					callback("Account's permission denied", rows);
					return;
				}
				callback(err, rows);
				return;
			}

			// INSERT a relation of managing the board . 
			const query = `INSERT INTO manage_HB (b_ID, h_UserID) VALUE
				((SELECT LAST_INSERT_ID() FROM bulletinBoard LIMIT 1), '${account}');`;

			Connections.admin.query(query, callback);
		}

		/**
		 * Execute the query
		 */
		Connections.admin.query(query, insertManage_HB);
	}

	static boardLastInsert = 0;
}




module.exports = Board;