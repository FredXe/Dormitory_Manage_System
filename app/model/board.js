const Connections = require("./connections");
const User = require("./user");
const Util = require("./util");
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

	/**
	 * SELECT all the Posts
	 * @param {(err, rows)} callback `rows` will filled with
	 * Posts formed as [{`Post1`}, {`Post2`}, ...]
	 */
	static selectPost(id, callback) {
		// SELECT all the bulletinBoard
		const query = `SELECT b_ID AS ID, title, b_text AS content 
		FROM bulletinBoard WHERE b_ID LIKE '${id}' ORDER BY b_ID ASC;`;

		Connections.admin.query(query, function (err, rows) {
			if (err) {
				callback(err, rows);
				return;
			}
			rows = Util.decodeRows(rows);
			callback(err, rows);
		});
	}

	/**
	 * Insert a comment.
	 * @param {string} account UserID that do the comment
	 * @param {number} b_ID ID of `bulletinBoard`
	 * @param {string} text Content of comment
	 * @param {(err, rows)} callback `err` will be filled
	 * on error.
	 */
	static comment(account, b_ID, text, callback) {
		// INSERT a new comment
		const query = `INSERT INTO comment (UserID, b_ID, c_text)
			VALUE ('${account}', ${b_ID}, '${text}');`;

		Connections.admin.query(query, callback);
	}

	/**
	 * Edit a comment
	 * @param {string} account UserID to edit the comment
	 * @param {number} b_ID ID of `bulletinBoard`
	 * @param {number} c_ID ID of `comment`
	 * @param {string} text Content to edit
	 * @param {(err, rows)} callback `rows.affectedRows` == 1 if
	 * edit success, 0 if failed.
	 */
	static editComment(account, b_ID, c_ID, text, callback) {
		// Edit the comment
		const query = `UPDATE comment SET c_text='${text}'
			WHERE UserID='${account}' AND b_ID=${b_ID} AND c_No=${c_ID};`;

		Connections.admin.query(query, callback);
	}

	/**
	 * SELECT the comment with specific `b_ID`
	 * @param {number} b_ID ID of `bulletinBoard`
	 * @param {(err, rows)} callback `rows` will filled with
	 * comments formed as [{`comment1`}, {`comment2`}, ...]
	 */
	static selectCommentByBID(b_ID, callback) {
		// SELECT comment has specific b_ID
		const query = `SELECT c_NO AS no, b_ID AS ID, c_text AS text,
			UserID AS account, createTime, lastEdit
			FROM comment WHERE b_ID=${b_ID} ORDER BY c_No ASC;`;

		Connections.admin.query(query, function (err, rows) {
			if (err) {
				callback(err, rows);
				return;
			}

			rows = Util.decodeRows(rows);
			callback(err, rows);
		});

	}

	static boardLastInsert = 0;
}

module.exports = Board;