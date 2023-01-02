/**
 * File for testing
 */

const User = require("./model/user");
const Connections = require("./model/connections");

const user = new User();

function handler(err, rows) {
	if (err) {
		console.error(err);
	}
	console.log(rows);


}



user.Admin.regist({
	UserID: 'a1095532', Password: 'qwe', name: 'Fred', eroll_year: 2019, userType: "student"
}, (err, rows) => {
	if (err) {
		console.error(err);
	}
	console.log("Inserted: ", rows);
});

// user.login({ account: "a1095500", password: "test" }, handler);
user.login({ account: "a1095532", password: "qwe" }, handler);

setTimeout(() => {
	Connections.close();
}, 1000);


