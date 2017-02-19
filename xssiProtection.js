"use strict";

const xssiProtectionPrefix = "for(;;);";

module.exports = function (req, res, next) {

	res.json = payload => {
		if (typeof payload === "object") {
			payload = JSON.stringify(payload);
		}

		payload = xssiProtectionPrefix + payload;

		res.set("Content-Type", "application/json");

		res.send(payload);
	};

	next();

};