const express = require("express");
const cookieParser = require("cookie-parser");
const path = require('path');
// const qs = require('querystring');

const app = require("../app");
const token = require("../middleware/token");
const root = require("./root");
const user = require("./user");
const board = require("./board");
const util = require("./util");


// app.set('views' , path.join(__dirname , 'views'));
// app.set('view engine' , 'html');

var urlParser = util.urlParser;

/**
 * Configure the express middlewares.
 */
// Set Third-party middleware
app.use(cookieParser());
app.use(express.json());
// Set static route.
app.use(express.static('public'));
// Set Util middleware.
app.use(token.verify);
// Set router middleware.
app.use(root);
app.use("/user", user);
app.use("/board", board);

