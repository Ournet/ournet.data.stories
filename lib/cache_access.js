'use strict';

var core = require('ournet.core');
var _ = core._;
var Promise = core.Promise;
var cache = new core.MemoryCache();
var util = require('util');
var AccessService = require('./access.js');
var internal = {};

var Service = module.exports = function Service() {
	AccessService.apply(this, arguments);
};

util.inherits(Service, AccessService);

Service.prototype.stories = function(params, options) {

	var defaults = {
		ttl: 60 * 10,
		cache: true
	};

	return internal.get(this, 'stories', params, options, defaults);
};

internal.get = function(self, name, params, options, defaults) {
	var key = name + '-' + JSON.stringify(params),
		cacheData = cache.get(key);

	if (cacheData) {
		return Promise.resolve(cacheData);
	}

	options = _.defaults(options || {}, defaults);

	return AccessService.prototype[name].call(self, params).then(function(result) {
		if (result && options.cache) {
			cache.set(key, result, options.ttl);
		}
		return result;
	});
};
