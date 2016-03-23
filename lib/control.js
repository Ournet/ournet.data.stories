'use strict';

require('./db/models');

var vogels = require('vogels-helpers');
var utils = require('./utils');
var Promise = utils.Promise;
var buildOptions = utils.buildServiceOptions;
var counter = Promise.promisifyAll(require('statefulco').counter);
var Search = require('./search');

function Service() {}

module.exports = Service;

/**
 * Create a story
 */
Service.prototype.createStory = function(data, options) {
	var self = this;

	return counter.incAsync('web-story')
		.then(function(id) {
			data.id = id;
			return self.insertStory(data, options);
		});
};

/**
 * Insert a story
 */
Service.prototype.insertStory = function(data, options) {
	var self = this;

	options = buildOptions(options);

	return vogels.control.create('Story', data, options)
		.then(function(story) {
			if (!story) {
				return story;
			}
			return self.createTopicStoriesFromStory(story)
				.then(function() {
					return Search.createStory(story)
						.then(function() {
							return story;
						});
				});
		});
};

/**
 * Create a topic story
 */
Service.prototype.createTopicStory = function(data, options) {
	options = buildOptions(options);

	return vogels.control.create('TopicStory', data, options);
};

/**
 * Update Story
 */
Service.prototype.updateStory = function(data, options) {
	options = buildOptions(options);

	return vogels.control.update('Story', data, options);
};

Service.prototype.createTopicStoriesFromStory = function(data, options) {
	var story = {
		id: data.id,
		title: data.title,
		uniqueName: data.uniqueName,
		summary: utils.wrapAt(data.summary, 500),
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
		return self.createTopicStory(item, options);
	});
};
