const Connections = require("./connections");
const Util = require("./util");

class Violation {
	/**
	 * INSERT a new violation record.
	 * @param {string} account The boarder.
	 * @param {string} type Violation record type.
	 * @param {(err, rows)} callback 
	 */
	static insertRecord(account, type, callback) {
		const query = `INSERT INTO violationRecord (UserID, v_type) VALUE ('${account}', '${type}');`;

		Connections.admin.query(query, callback);
	}

	/**
	 * SELECT all the `violationRecord`.
	 * @param {(err, rows)} callback 
	 * `rows`: [{`ID`, `account`, `date`, `type`}]
	 */
	static showRecord(account, callback) {
		const query = `SELECT v_ID AS ID, UserID AS account, v_date AS date, v_type AS type
			FROM violationRecord WHERE UserID LIKE '${account}';`;

		Connections.admin.query(query, function (err, rows) {
			if (err) {
				callback(err, rows);
				return;
			}
			rows = Util.decodeRows(rows);
			callback(err, rows);
		});
	}

}


module.exports = Violation;