'use strict';

var core = require('ournet.core');
var Promise = core.Promise;
var _ = core._;
var models = require('./db/models');
var internal = {};
var utils = require('./utils');

var Service = module.exports = function() {

};

/**
 * Story by id
 */
Service.prototype.story = function(params) {
	return models.Story.getAsync(params.id, params.params).then(internal.get);
};

/**
 * Stories by ids
 */
Service.prototype.stories = function(params) {
	return models.Story.getItemsAsync(params.ids, params.params)
		.then(internal.get)
		.then(function(stories) {
			if (!stories || stories.length === 0 || !params.sort) {
				return stories;
			}
			var item, list = [];
			params.ids.forEach(function(id) {
				item = _.find(stories, {
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
Service.prototype.topicStories = function(params) {
	return new Promise(function(resolve, reject) {
		models.TopicStory
			.query(params.topicId)
			.limit(params.limit)
			.descending()
			.exec(function(error, result) {
				if (error) {
					return reject(error);
				}
				result = internal.get(result.Items);
				if (!result || result.length === 0) {
					return result;
				}
				result = result.map(function(item) {
					return internal.get(item).story;
				});
				resolve(result);
			});
	});
};

/**
 * get stories ids by topic
 */
Service.prototype.topicStoriesIds = function(params) {
	return new Promise(function(resolve, reject) {
		models.TopicStory
			.query(params.topicId)
			.limit(params.limit)
			.attributes(['storyId'])
			.descending()
			.exec(function(error, result) {
				if (error) {
					return reject(error);
				}
				result = internal.get(result.Items);
				if (result && result.length > 0) {
					result = result.map(function(item) {
						return item.storyId;
					});
				}
				resolve(result);
			});
	});
};

internal.get = utils.get;
