const Connections = require("./connections");
const { updateEquipStatus } = require("./dormitory");
const Util = require("./util");

class Application {

	/**
	 * Request for an `application`.
	 * @param {string} account 
	 * Account who request.
	 * @param {number} semester In AD year form.
	 * @param {(err, rows)} callback 
	 */
	static requestForApplication(account, semester, callback) {
		// INSERT an `application`
		const query = `INSERT INTO application (studentUserID, a_semester)
			VALUE ('${account}', ${semester});`;

		Connections.admin.query(query, callback);
	}

	/**
	 * Apply the `application`.
	 * @param {string} account The account of the student.
	 * @param {number} room 
	 * The roomNumber of where he/she will life.
	 * @param {string} dormitory 
	 * The dormitory where `room` locate.
	 * @param {string} admin The admin who approved.
	 * @param {(err, rows)} callback 
	 */
	static apply(account, room, dormitory, admin, callback) {
		// INSERT the user INTO `boarder`
		const query = `INSERT INTO boarder (UserID, r_number, d_name, adminUserID) 
			VALUE ('${account}', ${room}, '${dormitory}', '${admin}');`;

		Connections.admin.query(query, _updateApplication);

		function _updateApplication(err, rows) {
			if (err) {
				callback(err, rows);
				return;
			}

			// UPDATE the status of the `application`
			const query = `UPDATE application SET a_approved='Y', a_Paid='N', adminUserID='${admin}'
				WHERE studentUserID='${account}';`;

			Connections.admin.query(query, callback);
		}
	}

	/**
	 * Reject the application.
	 * @param {string} account 
	 * The account of the student.
	 * @param {string} admin 
	 * The admin who reject.
	 * @param {(err, rows)} callback 
	 */
	static reject(account, admin, callback) {
		// INSERT the student INTO nonBoarder.
		const query = `INSERT INTO nonBoarder VALUE ('${account}');`;

		Connections.admin.query(query, _updateApplication);

		function _updateApplication(err, rows) {
			if (err) {
				callback(err, rows);
				return;
			}
			// UPDATE the status of the `application`.
			const query = `UPDATE application SET a_approved='N', adminUserID='${admin}';`;

			Connections.admin.query(query, callback);
		}

	}

	/**
	 * SELECT all the `application`.
	 * @param {(err, rows)} callback 
	 * `rows`: [{`studentUserID`, `semester`, `date`, 
	 * `approved`, `paid`, `adminUserID`, `approvedTime`}, { }...]
	 */
	static showApplication(callback) {
		// 
		const query = `SELECT studentUserID, a_semester AS semester, 
			a_Date AS date, a_approved AS approved, a_Paid AS paid, adminUserID, approvedTS AS approvedTime
			FROM application;`;

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
	 * SELECT the `applications` that not applied yet
	 * @param {(err, rows)} callback 
	 * `rows`: [{`studentUserID`, `semester`, `date`, 
	 * `approved`, `paid`, `adminUserID`, `approvedTime`}, { }...]
	 */
	static showNotAppliedYet(callback) {
		const query = `SELECT studentUserID, a_semester AS semester, 
			a_Date AS date, a_approved AS approved, a_Paid AS paid, adminUserID
			FROM application WHERE a_approved='U';`;

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
	 * SELECT the specific `application`.
	 * @param {(err, row)} callback 
	 * `row`: {`studentUserID`, `semester`, `date`, 
	 * `approved`, `paid`, `adminUserID`, `approvedTime`}
	 */
	static showApplicationInfo(account, callback) {
		const query = `SELECT studentUserID, a_semester AS semester, 
		a_Date AS date, a_approved AS approved, a_Paid AS paid, adminUserID
		FROM application WHERE studentUserID='${account}';`;

		Connections.admin.query(query, function (err, rows) {
			if (err) {
				callback(err, rows);
				return;
			}
			rows = Util.decodeRows(rows)[0];
			callback(err, rows);
		});

	}

	/**
	 * Mark the `application`.`paid` AS `Y`
	 * @param {string} account The boarder who paid
	 * @param {(err, rows)} callback 
	 */
	static pay(account, callback) {
		// Get the application info first.
		Application.showApplicationInfo(account, _updatePaid);

		function _updatePaid(err, rows) {
			if (err) {
				callback(err, rows);
				return;
			}

			// Check if the appliaction is needed to pay.
			if (rows.approved != "Y" || rows.paid != "N") {
				callback("This application doesn't have to Paid.", rows);
				return;
			}

			// UPDATE the `application`.`paid`.
			const query = `UPDATE application SET a_Paid='Y' WHERE studentUserID='${account}';`;

			Connections.admin.query(query, callback);
		}
	}

}


module.exports = Application;