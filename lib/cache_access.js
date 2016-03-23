'use strict';

var utils = require('./utils');
var _ = utils._;
var Promise = utils.Promise;
var cache = require('memory-cache');
var util = require('util');
var AccessService = require('./access.js');

function Service() {
	AccessService.apply(this, arguments);
}

module.exports = Service;

util.inherits(Service, AccessService);

function cacheGet(self, name, params, options, defaults) {
	var key = name + '-' + JSON.stringify(params);
	var cacheData = cache.get(key);

	if (cacheData) {
		return Promise.resolve(cacheData);
	}

	options = _.defaults(options || {}, defaults);

	return AccessService.prototype[name].call(self, params, options)
		.then(function(result) {
			if (result && options.cache > 0) {
				cache.put(key, result, options.cache * 1000);
			}
			return result;
		});
}

Service.prototype.stories = function(ids, options) {

	var defaults = {
		cache: 30
	};

	return cacheGet(this, 'stories', ids, options, defaults);
};
