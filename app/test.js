/**
 * File for testing
 */

const User = require("./model/user");
const Connections = require("./model/connections");

const user = new User();

Connections.init();

function handler(err, rows) {
	if (err) {
		console.error(err);
	}
	console.log(rows);
}

// user.Admin.regist({
// 	UserID: 'fortest', Password: 'test', name: 'Test', eroll_year: 2019, userType: "student"
// }, (err, rows) => {
// 	if (err) {
// 		console.error(err);
// 	}
// 	console.log("Inserted: ", rows);
// });

user.login({ account: "testadmin", password: "csie" }, handler);
