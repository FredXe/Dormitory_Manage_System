const express = require("express");
const cookieParser = require("cookie-parser");
// const qs = require('querystring');

const app = require("../app");
const token = require("../middleware/token");
const root = require("./root");
const user = require("./user");
const util = require("./util");

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

