class Util {
	/**
	 * Convert Rows into Object with JSON's 
	 * static functions
	 * @param {RowDataPacket} rows Rows input
	 * @returns Object that `rows` expressed
	 */
	static decodeRows(rows) {
		return Object.values(JSON.parse(JSON.stringify(rows)));
	}

}

module.exports = Util;
