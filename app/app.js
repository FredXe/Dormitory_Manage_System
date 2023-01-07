const express = require("express");
const path = require('path');
const app = express();

app.set('views' , './views/');
app.set('view engine' , 'ejs');

app.listen(3000, () => {
	console.log(`Server is running http://localhost:3000/`);
});

module.exports = app;