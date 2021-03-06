'use strict';

require('./db/models');

var utils = require('./utils');
var _ = utils._;
var vogels = require('vogels-helpers');
var buildOptions = utils.buildServiceOptions;

function Service() {}

module.exports = Service;

/**
 * Story by id
 */
Service.prototype.story = function(id, options) {
	options = buildOptions(options);

	return vogels.access.getItem('Story', id, options);
};

/**
 * Stories by ids
 */
Service.prototype.stories = function(ids, options) {

	options = buildOptions(options);

	return vogels.access.getItems('Story', ids, options)
		.then(function(items) {
			if (!items || items.length === 0 || !options.sort) {
				return items;
			}
			var item, list = [];
			ids.forEach(function(id) {
				item = _.find(items, {
					id: id
				});
				if (item) {
					list.push(item);
				}
			});
			return list;
		});
};

/**
 * get stories by topic
 */
Service.prototype.topicStories = function(topicId, options) {

	options = _.defaults({ key: topicId }, options, {
		format: 'items',
		sort: 'descending',
		limit: 10
	});

	return vogels.access.query('TopicStory', options)
		.then(function(items) {
			if (!items || items.length === 0) {
				return items;
			}

			items = items.map(function(item) {
				return item.story;
			});

			return items;
		});
};

/**
 * get stories ids by topic
 */
Service.prototype.topicStoriesIds = function(topicId, options) {

	options = _.defaults({ key: topicId }, options, {
		format: 'items',
		attributes: ['storyId'],
		sort: 'descending',
		limit: 10
	});

	return vogels.access.query('TopicStory', options)
		.then(function(items) {
			if (!items || items.length === 0) {
				return items;
			}

			items = items.map(function(item) {
				return item.storyId;
			});

			return items;
		});
};

/**
 * Important stories ids
 */
Service.prototype.importantStoriesIds = function(key, options) {
	options = _.defaults({
			index: 'importantStories-index',
			key: key
		},
		options, {
			format: 'items',
			sort: 'descending',
			limit: 10
		});

	return vogels.access.query('Story', options)
		.then(function(items) {
			if (!items || items.length === 0) {
				return items;
			}

			return items.map(function(item) {
				return item.id;
			});
		});
};
