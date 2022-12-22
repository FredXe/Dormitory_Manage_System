/**
 * File for testing
 */

const Db = require("./model/user");

const db = new Db();

db.Admin.insertUsers({
	UserID: 'fortest', Password: 'test', eroll_year: 2019
}).then((rows) => {
	console.log(rows);
});

db.login("fred", "test").then((ret) => {
	console.log(ret);
});


db.close();