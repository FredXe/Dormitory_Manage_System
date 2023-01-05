const User = require("./user");
const Board = require("./board");
const Dormitory = require("./dormitory");

function handler(err, rows) {
	if (err) {
		console.error(err);
	}
	console.log(rows);
	// Connections.close();

}

User.Admin.regist({
	UserID: 'a1095532', Password: 'qwe', name: 'Fred', eroll_year: 2019, userType: "student"
}, handler);

User.Admin.regist({
	UserID: 'a1095511', Password: 'qwe', name: 'Fred', eroll_year: 2019, userType: "houseMaster"
}, handler);

User.Admin.regist({
	UserID: 'a1095500', Password: 'qwe', name: 'Fred', eroll_year: 2019, userType: "admin"
}, handler);

Dormitory.insertDormitory("Node test Dormitory", "a1095500", 500, handler);

Dormitory.insertDormitory("Node test Dormitory", "a1095500", 500, handler);
