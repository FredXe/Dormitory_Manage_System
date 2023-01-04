/**
 * File for testing
 */
// const route = require("./route/route");
const User = require("./model/user");
const Connections = require("./model/connections");
const Board = require("./model/board");

function handler(err, rows) {
	if (err) {
		console.error(err);
	}
	console.log("handler:", rows);
	Connections.close();

}

Board.post("test", "TITLE", "NODE test :D:D:D", handler);

// User.getAccountInfo("test", handler);

// User.Admin.delete("a1095532", handler);

// User.Admin.regist({
// 	UserID: 'a1095532', Password: 'qwe', name: 'Fred', eroll_year: 2019, userType: "student"
// }, (err, rows) => {
// 	if (err) {
// 		console.error(err);
// 	}
// 	console.log("Inserted: ", rows);
// });

// User.login({ account: "a1095532", password: "qwe" }, handler);


// setTimeout(() => {
// 	Connections.close();
// }, 1000);


