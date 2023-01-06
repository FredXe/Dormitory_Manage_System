const Connections = require("./connections");
const Util = require("./util");

class Violation {
	static insertRecord(account, type, callback) {
		const query = `INSERT INTO violationRecord (UserID, v_type) VALUE ('${account}', '${type}');`;

		Connections.admin.query(query, callback);
	}

	static showRecord(callback) {
		const query = `SELECT v_ID AS ID, UserID AS account, v_date AS date, v_type AS type FROM violationRecord;`;

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