/**
 * File for test the 
 */

const db = require("./lib/db");

db.init();

db.Admin.insertUsers({
	UserID: 'fred', Password: 'test', eroll_year: 2019
});

db.login("fred", "test", () => { });


db.close();