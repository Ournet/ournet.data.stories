'use strict';

var utils = require('ournet.utils');
var atonic = require('atonic');
var _ = require('lodash');
var Promise = require('bluebird');

exports.buildServiceOptions = function buildServiceOptions(options, defaults) {
	defaults = defaults || {
		format: 'json'
	};

	return _.defaults(options || {}, defaults);
};

exports.wrapAt = function wrapAt(text, position) {
	if (text && text.length > position) {
		return text.substr(0, position - 3) + '...';
	}

	return text;
};

module.exports = exports = _.assign({
	_: _,
	Promise: Promise,
	atonic: atonic
}, exports, utils);
