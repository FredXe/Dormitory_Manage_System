const mysql = require("mysql");

class Connections {
	static init = () => {
		Connections.admin.connect();
	}

	// Connection that log in with 'admin'
	static admin = mysql.createConnection({
		host: 'tupao.one',
		user: 'admin',
		password: 'a1095500',
		database: 'dormitory'
	})

	static close = () => {
		Connections.admin.end();
	}


}

module.exports = Connections;
