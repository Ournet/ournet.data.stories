'use strict';

if (!process.env.AWS_REGION) {
	console.log('no AWS_REGION');
	module.exports = false;
	return;
}

var AccessService = require('../../lib').AccessService;
var ControlService = require('../../lib').ControlService;

exports.access = new AccessService();
exports.control = new ControlService();
