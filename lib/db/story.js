'use strict';

var utils = require('../utils');
var _ = utils._;

function normalizeStory(data) {
	data = _.pick(data, 'id', 'title', 'summary', 'uniqueName', 'host', 'path', 'countNews', 'countViews', 'countQuotes', 'countVideos', 'webpageId', 'lang', 'country', 'createdAt', 'imageId', 'imageHost', 'news', 'topics', 'videos', 'quotes', 'category', 'importantKey');
	data.culture = [data.country, data.lang].join('_');
	data.topics = data.topics || [];

	data.topics = data.topics.map(function(topic) {
		return utils.cleanObject(_.pick(topic, 'id', 'name', 'uniqueName', 'abbr', 'key', 'wikiId', 'type', 'category'));
	});
	data.topics = _.uniq(data.topics, 'id');
	//data.topics = _.uniq(data.topics, 'uniqueName');

	if (data.topics.length === 0) {
		return null;
	}
	if (!data.summary) {
		return null;
	}

	data.news = [];

	data.summary = utils.wrapAt(data.summary, 884);

	data.videos = data.videos || [];

	data.videos = _.uniq(data.videos);

	data.countVideos = data.videos.length;
	data.quotes = data.quotes || [];
	data.countQuotes = data.quotes.length;

	return utils.cleanObject(data);
}

exports.config = {
	// updateSchema: updateSchema,
	createNormalize: normalizeStory //,
		// updateNormalize: normalizeUpdate,
		// createValidate: validateCreate,
		// updateValidate: validateUpdate
};

exports.normalizeStory = normalizeStory;
