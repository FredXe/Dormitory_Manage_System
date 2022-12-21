/**
 * File for test the 
 */

const db = require("./server/db");

db.init();

db.Admin.insertUsers({
	UserID: 'fred', Password: 'test', eroll_year: 2019
});