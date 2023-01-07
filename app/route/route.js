const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const User = require('../model/user');
const { send } = require('process');

const port = 3000;
const ip = '127.0.0.1';
const app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.json());
app.use(express.static('public'));

const sendResponse = (filename, statuscode, res) => {
	fs.readFile(`${filename}`, (error, data) => {
		// console.log(filename);
		if (error) {
			res.statuscode = 500;
			res.setHeader('Content-Type', 'text/plain');
			res.send('Error');
		} else {
			res.statuscode = statuscode;
			res.setHeader('Content-Type', 'text/html');
			res.end(data);
		}
	});
};

// function handler(err, rows) {
// 	if (err) {
// 		console.error(err);
// 	}
// 	console.log(rows);
// 	// Connections.close();

// }


app.get('/', (req, res) => {
	sendResponse("./view/login.html", 200, res);
});

// app.get('/public/*', (req, res) => {
// 	const url = '.' + req.url;
// 	sendResponse(url, 200, res);
// });

app.post('/login', urlencodedParser, (req, res) => {
	const { account: userID, password } = req.body;
	User.login({ account : userID , password : password}, (error , rows) => {
		if(error){
			console.error(err);
		}else{
			switch (rows['privilege']){
				case 'student' :
					sendResponse('./view/Student.html' , 200 , res);
					break;
				case 'houseMaster' :
					res.end('hourseMaster');
					break;
			}
		}	
	});
});


app.listen(port, ip, () => {
	console.log(`Server is running http://${ip}:${port}/`)
});