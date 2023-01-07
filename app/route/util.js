const fs = require('fs');
const bodyParser = require('body-parser');


const urlParser = bodyParser.urlencoded({ extended: false });

/**
 * Response a HTML file.
 * @param {string} filename 
 * @param {number} statuscode 
 * @param {*} res 
 * The `res` of router's handler.
 */
function responseHtml(filename, statuscode, res) {
	fs.readFile(`${filename}`, function (error, data) {
		if (error) {
			res.statuscode = 500;
			res.setHeader('Content-Type', 'text/html');
			res.send(Buffer.from('<h1>Error</h1>'));
			res.end();
		} else {
			res.statuscode = statuscode;
			res.setHeader('Content-Type', 'text/html');
			res.send(data);
			res.end();
		}
	});
};


module.exports = { responseHtml, urlParser };