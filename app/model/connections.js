const mysql = require("mysql");
require("dotenv").config({ path: "app/model/.env" });

class Connections {
	static init = () => {
		Connections.admin.connect();
	}

	// Connection that log in with 'admin'
	static admin = mysql.createConnection({
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_ADMIN,
		password: process.env.DB_ADMIN_PASSWORD,
		database: process.env.DATABASE
	})

	static close() {
		Connections.admin.end();
	}
}

Connections.admin.connect();

module.exports = Connections;
