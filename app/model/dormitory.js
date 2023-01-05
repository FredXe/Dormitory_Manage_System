const Connections = require("./connections");
const User = require("./user");
const Util = require("./util");

class Dormitory {

	/**
	 * INSERT a dormitory into `dormitory`.
	 * Then INSERT the number of dormitory's 
	 * capacityrooms into `room`.
	 * NOTE: This function will not check the privilege.
	 * @param {string} name Name of `dormitory`
	 * @param {string} account `adminUserID` who manage the `dormitory`
	 * @param {number} volume The number of rooms 
	 * `dormitory` can fit
	 * @param {number} r_volume Volume of a room
	 * @param {number} cost Cost/person, semester
	 * @param {(err, rows)} callback `err` filled with
	 * `sqlMessage` on error.
	 */
	static insertDormitory(name, account, volume, r_volume, cost, callback) {
		const query = `INSERT INTO dormitory VALUE ('${name}', '${account}', ${volume})`;

		function insertRooms(err, rows) {
			if (err) {
				callback(err.sqlMessage, rows);
				return;
			}
			callback(err, rows);

			// INSERT new rooms
			for (let roomNumbers = 1; roomNumbers <= volume; roomNumbers++) {
				const query = `INSERT INTO room (d_name, r_number, r_volume, r_cost)
					VALUE ('${name}', ${roomNumbers}, ${r_volume}, ${cost})`;

				Connections.admin.query(query, function (err, rows) {
					if (err) {
						console.log(err, rows);
						return;
					}
				});
			}
		}

		Connections.admin.query(query, insertRooms);
	}

	/**
	 * INSERT a manage relation into `manage_HD`.
	 * @param {string} houseMaster UserID of `houseMaster`
	 * @param {string} dormitory name of `dormitory`
	 * @param {(err, rows)} callback 
	 */
	static insertMngDormitory(houseMaster, dormitory, callback) {
		const query = `INSERT INTO manage_HD 
			VALUE ('${houseMaster}', '${dormitory}');`;

		Connections.admin.query(query, callback);
	}

	/**
	 * SELECT all the `dormitory`.
	 * @param {(err, rows)} callback 
	 * `rows`:  [{`dormitory1`}, {`dormitory2`},...]
	 */
	static showDormitory(callback) {
		const query = `SELECT d_name AS name, d_volume AS volume, adminUserID AS admin FROM dormitory;`;

		Connections.admin.query(query, function (err, rows) {
			if (err) {
				console.error(err);
				return;
			}
			rows = Util.decodeRows(rows);

			callback(err, rows);
		});
	}

	/**
	 * SELECT `manage_HD` by name of `dormitory`.
	 * @param {string} dormitory Name of `dormitory`,
	 * '%' to select all the rows.
	 * @param {(err, rows)} callback 
	 * `rows`: [{`manage1`}, {`manage2`},...]
	 */
	static showMngDormitory(dormitory, callback) {
		const query = `SELECT UserID AS houseMaster, d_name AS dormitory 
			FROM manage_HD WHERE d_name LIKE '${dormitory}'
			ORDER BY d_name`;

		Connections.admin.query(query, function (err, rows) {
			if (err) {
				console.error(err);
				return;
			}
			rows = Util.decodeRows(rows);

			callback(err, rows);
		});
	}

	/**
	 * INSERT a room into `room`.
	 * NOTE: This function will not check the privilege.
	 * @param {string} d_name Name of the `dormitory` where the `room` located
	 * @param {number} r_volume Volume of the `room`
	 * @param {number} r_cost Cost/person per Semester
	 * @param {(err, row)} callback Callback of the query 
	 */
	static insertRoom(d_name, r_volume, r_cost, callback) {
		// INSERT a new room
		const query = `INSERT INTO room (d_name, r_volume, r_cost)
						VALUE ('${d_name}', ${r_volume}, ${r_cost})`;

		Connections.admin.query(query, callback);
	}

	/**
	 * SELECT the rooms of specific `dormitory`
	 * @param {string} d_name Name of the `dormitory`
	 * @param {(err, rows)} callback 
	 * `rows`: [{`room1`}, {`room2`},...]
	 */
	static showRoomsByDormitory(d_name, callback) {
		const query = `SELECT r_number AS number,
			r_volume AS volume,
			r_cost AS cost FROM room WHERE d_name='${d_name}'`;

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

module.exports = Dormitory;