/**
 * File for test the 
 */

const Db = require("./lib/db");

const db = new Db();

db.Admin.insertUsers({
	UserID: 'fred', Password: 'test', eroll_year: 2019
});

db.login("fred", "test", () => { });


db.close();