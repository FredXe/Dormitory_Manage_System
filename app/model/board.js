const Connections = require("./connections");
const User = require("./user");

class Board {
	/**
	 * Post an article on bulletinBoard.
	 * @param {string} account The author.
	 * @param {string} title Title
	 * @param {string} text The post's content
	 * @param {(err, rows)} callback `rows.affectedRows` == 1
	 * if success. `err` = "Account's permission denied" if
	 * the account has no privilege.
	 * NOTE: Only a user with privilege higher than
	 * houseMaster can post an article.
	 */
	static post(account, title, text, callback) {

		/**
		 * Declare the callback functions
		 */
		function insertManage_HB(err, rows) {
			// INSERT a relation of managing the board. 
			const query = `INSERT INTO manage_HB (b_ID, h_UserID) VALUE
				((SELECT LAST_INSERT_ID() FROM bulletinBoard LIMIT 1), '${account}');`;

			Connections.admin.query(query, callback);
		}

		function insertPost(err, rows) {
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

			if (rows == undefined) {
				callback("no such account", rows);
				return;
			}

			if (["houseMaster", "admin"].includes(rows.privilege) == false) {
				callback("Account's permission denied", rows);
				return;
			}

			// INSERT a row into `bulletinBoard`
			const query = `INSERT INTO bulletinBoard (title, b_text) VALUE ('${title}', '${text}');`;

			Connections.admin.query(query, insertManage_HB);
		}

		/**
		 * Execute the query
		 */
		User.getAccountInfo(account, insertPost);
	}

	static comment(account, b_ID, text) {
		const query = ``;
	}

	static editComment(account, b_ID, c_ID, text) { }

	static boardLastInsert = 0;
}




module.exports = Board;