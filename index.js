"use strict";

const call = require("secure-call");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const contentLengthValidator = require("express-content-length-validator");
const bodyParser = require("body-parser");
const hpp = require("hpp");
const xssiProtection = require("./xssiProtection");


let beforeStartupCalls = [];
let afterStartupCalls = [];
let registerRouteCalls = [];
let xssiProtectionDisabled = false;


module.exports = {
	beforeStartup,
	start,
	registerRoutes,
	afterStartup,
	disableXssiProtection
};


function createApp () {
	let app = express();

	app.use(helmet.frameguard({ // prevent embedding in frames
		action: "deny"
	}));
	app.use(helmet.hsts({	// suggest https for the next 90 days
		maxAge: 1000 * 60 * 60 * 24 * 90
	}));
	app.use(helmet.hidePoweredBy());	// hide the x-powered-by header
	app.use(helmet.noCache());	// prevent caching

	app.use(compression());

	app.use(contentLengthValidator.validateMax({	// allow max content-length of 50mib
		max: 1024 * 1024 * 50
	}));

	app.use(bodyParser.urlencoded({
		limit: "50mb",
		extended: true
	}));
	app.use(bodyParser.json({
		limit: "50mb"
	}));

	app.use(hpp());	// prevent http parameter pollution

	if (process.env.NODE_ENV !== "test" && !xssiProtectionDisabled) {
		app.use(xssiProtection);
	}

	return app;
}


function disableXssiProtection () {
	xssiProtectionDisabled = true;
}


function beforeStartup (callback) {
	beforeStartupCalls.push(callback);
}


function afterStartup (callback) {
	afterStartupCalls.push(callback);
}


function registerRoutes (callback) {
	registerRouteCalls.push(callback);
}


function callArray (arr, val) {
	arr.forEach(cb => {
		call(cb, val);
	});
}


function start (port, path) {
	if (!port) {
		port = process.env.PORT || 8080;
	}

	if (typeof path !== "string") {
		path = "";
	}

	let app = createApp();

	callArray(beforeStartupCalls, app);

	const router = express.Router();

	callArray(registerRouteCalls, router);

	app.use("/" + path, router);

	let server = app.listen(port);

	server.timeout = 360000;

	callArray(afterStartupCalls);
}


