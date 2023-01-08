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

		function _insertRooms(err, rows) {
			if (err) {
				callback(err.sqlMessage, rows);
				return;
			}
			callback(err, rows);

			// INSERT new rooms
			for (let roomNumbers = 1; roomNumbers <= volume; roomNumbers++) {

				Dormitory.insertRoom(name, roomNumbers, r_volume, cost, function (err, rows) {
					if (err) {
						console.log(err, rows);
						return;
					}
				});
			}
		}

		Connections.admin.query(query, _insertRooms);
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
		const query = `SELECT d_name AS name, d_volume AS volume, adminUserID AS admin,
			r_cost AS cost FROM dormitory NATURAL JOIN room
			GROUP BY d_name;`;

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
	 * @param {number} number Number of the `room`
	 * @param {number} volume Volume of the `room`
	 * @param {number} cost Cost/person per Semester
	 * @param {(err, row)} callback Callback of the query 
	*/
	static insertRoom(d_name, number, volume, cost, callback) {
		// INSERT a new room
		const query = `INSERT INTO room (d_name, r_number, r_volume, r_cost)
		VALUE ('${d_name}', ${number}, ${volume}, ${cost})`;

		Connections.admin.query(query, _insertEquipment);

		function _insertEquipment(err, rows) {
			if (err) {
				callback(err, rows);
				return;
			}

			var equipments = [];

			// Fill beds
			for (var bedCnt = 1; bedCnt <= volume; bedCnt++) {
				const eName = `bed${bedCnt}`;
				equipments.push({ type: "furniture", eName: eName, condition: "normal", roomNumber: number, dormitoryName: "Node test Dormitory" });
			}
			// Fill desks
			for (var deskCnt = 0; deskCnt <= volume; deskCnt++) {
				const eName = `desk${deskCnt}`;
				equipments.push({ type: "furniture", eName: eName, condition: "normal", roomNumber: number, dormitoryName: "Node test Dormitory" });
			}
			// Fill facilities
			equipments.push({ type: "furniture", eName: "toilet", condition: "normal", roomNumber: number, dormitoryName: "Node test Dormitory" });
			equipments.push({ type: "furniture", eName: "shower", condition: "normal", roomNumber: number, dormitoryName: "Node test Dormitory" });
			equipments.push({ type: "furniture", eName: "aircon", condition: "normal", roomNumber: number, dormitoryName: "Node test Dormitory" });


			Dormitory.insertEquipment(equipments, callback);
		}


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

	/**
	 * INSERT equipments
	 * @param {Array} equipment 
	 * [{`type`, `eName`, `condition`, `roomNumber`, `dormitoryName`}, {...}]
	 * @param {(err, rows)} callback 
	 */
	static insertEquipment(equipment = [{ type, eName, condition, roomNumber, dormitoryName }], callback) {
		// INSERT equipments into `equipment`
		var query = `INSERT INTO equipment (e_type, e_name, e_condition, r_number, d_name) VALUES`;

		// Concat parameter into query
		for (let index = 0; index < equipment.length; index++) {
			const type = equipment[index].type;
			const eName = equipment[index].eName;
			const condition = equipment[index].condition;
			const roomNumber = equipment[index].roomNumber;
			const dormitoryName = equipment[index].dormitoryName;

			query = query.concat(` ('${type}', '${eName}', '${condition}', ${roomNumber}, '${dormitoryName}')`);
			if (index != equipment.length - 1) {
				query = query.concat(",");
			}
		}
		query = query.concat(";");

		Connections.admin.query(query, callback);
	}

	/**
	 * UPDATE the specific equipment's status.
	 * @param {number} ID `e_ID` of the equipment
	 * @param {string} condition 
	 * Set to `null` if you don't wanna modify it.
	 * @param {number} roomNumber The room equipment are. 
	 * Set to `null` if you don't wanna modify it.
	 * @param {string} dormitoryName 
	 * The dormitory where the room locate.
	 * Set to `null` if you don't wanna modify it.
	 * @param {(err, rows)} callback 
	 */
	static updateEquipStatus(ID, condition, roomNumber, dormitoryName, callback) {
		var query = `UPDATE equipment SET `;

		/**
		 * Fill in the query if you wanna modify the column
		 */
		if (condition) {
			query = query.concat(`e_condition='${condition}' `);
			if (roomNumber) {
				query = query.concat(`, `);
			}
		}
		if (roomNumber) {
			query = query.concat(`r_number=${roomNumber}, `);
			/**
			 * Since type of `d_name` is string,
			 * we have to set it `null` instead
			 * of `'null'` if we wanna assign it
			 * `null`.
			 */
			if (dormitoryName.toLowerCase() == "null") {
				query = query.concat(`d_name=null`);
			} else {
				query = query.concat(`d_name='${dormitoryName}'`);
			}
		}
		query = query.concat(` WHERE e_ID=${ID};`);

		Connections.admin.query(query, callback);
	}

	/**
	 * SELECT all the equipments.
	 * @param {(err, rows)} callback 
	 * `rows`: [{`ID`, `condition`, `type`, `roomNumber`, `dormitoryName`}, { }...]
	 */
	static showEquipments(callback) {
		const query = `SELECT e_ID AS ID, e_condition AS \`condition\`, e_type AS type,
		r_number AS roomNumber, d_name AS dormitoryName
		FROM equipment;`;

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
	 * SELECT the equipment is not normal and
	 * with specific condition
	 * @param {string} condition The specific condition.
	 * Set to "%" if you don't wanna the condition filtered.
	 * @param {(err, rows)} callback 
	 * `rows`: [{`ID`, `condition`, `type`, `roomNumber`, `dormitoryName`}, { }...]
	 */
	static showProblemEquipment(condition, callback) {
		const query = `SELECT e_ID AS ID, e_condition AS \`condition\`, e_type AS type,
		r_number AS roomNumber, d_name AS dormitoryName
		FROM equipment WHERE e_condition<>'normal' AND e_condition LIKE '${condition}';`;

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
	 * SELECT the equipment that are not 
	 * locate in one room.
	 * @param {(err, rows)} callback 
	 * `rows`: [{`ID`, `condition`, `type`, `roomNumber`, `dormitoryName`}, { }...]
	 */
	static showAvailableEquipment(callback) {
		const query = `SELECT e_ID AS ID, e_condition AS \`condition\`, e_type AS type,
		r_number AS roomNumber, d_name AS dormitoryName
		FROM equipment WHERE r_number IS NULL AND d_name IS NULL;`;

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