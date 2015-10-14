'use strict';

var core = require('ournet.core');
var Data = require('ournet.data');
var Promise = core.Promise;
var models = require('./db/models');
var utils = require('./utils');
var Search = require('./search');
var internal = {};

internal.get = utils.get;

var Service = module.exports = function() {

};

/**
 * Create a story
 */
Service.prototype.createStory = function(data) {
	data = utils.normalizeStory(data);
	if (!data) {
		return Promise.reject(new Error('Story is invalid: 0 news'));
	}
	var self = this;
	return Data.counter.inc('web-story').then(function(id) {
		data.id = id;
		return models.Story.createAsync(data).then(function(story) {
			if (!story) {
				return story;
			}
			story = internal.get(story);
			return Search.createStory(story)
				.catch(function(error) {
					console.log('search createStory error', error);
				})
				.then(function() {
					return self.createTopicStoriesFromStory(story).then(function() {
						return story;
					});
				});
		});
	});
};

/**
 * Insert a story
 */
Service.prototype.insertStory = function(data) {
	data = utils.normalizeStory(data);
	if (!data) {
		return Promise.reject(new Error('Story is invalid: no data'));
	}
	var self = this;
	return models.Story.createAsync(data).then(function(story) {
		if (!story) {
			return story;
		}
		story = internal.get(story);
		return self.createTopicStoriesFromStory(story).then(function() {
			return story;
		});
	});
};

/**
 * Create a topic story
 */
Service.prototype.createTopicStory = function(data) {
	return models.TopicStory.createAsync(data).then(internal.get);
};

/**
 * Update Story
 */
Service.prototype.updateStory = function(data) {
	return models.Story.updateAsync(data).then(internal.get);
};

Service.prototype.createTopicStoriesFromStory = function(data) {
	var story = {
		id: data.id,
		title: data.title,
		uniqueName: data.uniqueName,
		summary: core.text.wrapAt(data.summary, 500),
		imageId: data.imageId,
		category: data.category,
		createdAt: data.createdAt
	};
	if (!story.category) {
		delete story.category;
	}
	if (!story.imageId) {
		delete story.imageId;
	}

	var list = data.topics.map(function(topic) {
		return {
			topicId: topic.id,
			storyId: story.id,
			story: story
		};
	});

	var self = this;

	return Promise.resolve(list).each(function(item) {
		return self.createTopicStory(item);
	});
};
