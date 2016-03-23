'use strict';

var vogels = require('vogels-helpers').vogels;
var Joi = require('vogels-helpers').Joi;

exports.Story = {
	id: Joi.number().integer().required(),
	title: Joi.string().trim().max(200).required(),
	uniqueName: Joi.string().trim().lowercase().max(64).required(),
	summary: Joi.string().trim().max(884).required(),

	host: Joi.string().trim().lowercase().max(64).required(),
	path: Joi.string().trim().max(512).required(),
	webpageId: Joi.string().length(32),

	lang: Joi.string().trim().length(2).lowercase().required(),
	country: Joi.string().trim().length(2).lowercase().required(),
	// COUNTRY_LANG
	culture: Joi.string().trim().length(5).lowercase().required(),

	category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90),

	imageId: Joi.string().length(32),
	imageHost: Joi.string().trim().lowercase().max(64),

	countNews: Joi.number().integer().min(2).required(),
	countViews: Joi.number().integer().min(0).default(0).required(),

	topics: Joi.array().items(Joi.object().keys({
		id: Joi.number().integer().required(),
		key: Joi.string().trim().length(32).required(),
		name: Joi.string().trim().max(100).required(),
		uniqueName: Joi.string().trim().lowercase().max(100).required(),
		abbr: Joi.string().trim().max(20),
		wikiId: Joi.number().integer(),
		type: Joi.valid(1, 2, 3, 4, 5),
		category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90)
	})).min(1).max(6).required(),

	news: Joi.array().items(Joi.object().keys({
		id: Joi.string().trim().length(32).required(),
		title: Joi.string().trim().min(2).max(200).required(),
		uniqueName: Joi.string().trim().min(2).max(64).required(),
		host: Joi.string().trim().min(2).max(64).required(),
		path: Joi.string().trim().max(512).required(),
		summary: Joi.string().trim().max(500),
		imageId: Joi.string().length(32),
		publishedAt: Joi.number().integer().required()
	})).min(0).max(5).required(),

	quotes: vogels.types.stringSet(), // Joi.array().items(Joi.string().length(32)).default([]).required(),
	countQuotes: Joi.number().integer().default(0),
	videos: vogels.types.stringSet(), // Joi.array().items(Joi.string().length(32)).default([]).required(),
	countVideos: Joi.number().integer().default(0)
};

exports.TopicStory = {
	topicId: Joi.number().integer().min(1).required(),
	storyId: Joi.number().integer().min(1).required(),

	story: Joi.object().keys({
		id: Joi.number().integer().required(),
		title: Joi.string().trim().max(200).required(),
		uniqueName: Joi.string().trim().lowercase().max(64).required(),
		summary: Joi.string().trim().max(500).required(),
		category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90),
		imageId: Joi.string().length(32),
		createdAt: Joi.date().required()
	})
};
