'use strict';

var utils = require('../utils');
var _ = utils._;

function createSummaryPrefix(text) {
	text = text.trim().substr(0, 100).toLowerCase();
	text = utils.atonic(text).replace(/[\s\.;,\?\/\\!:@#$%^&\*]+/gi, ' ').trim().replace(/ {2,}/gi, ' ');
	return text;
}

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
	var summaryPrefixes = [createSummaryPrefix(data.summary)];
	var sp;

	data.news = data.news || [];

	data.news = data.news.filter(function(item) {
		if (item.id === data.webpageId) {
			return false;
		}
		sp = createSummaryPrefix(item.summary);
		if (summaryPrefixes.indexOf(sp) > -1) {
			return false;
		}
		summaryPrefixes.push(sp);
		return true;
	});

	if (data.news.length === 0) {
		console.log('no news');
		return null;
	}

	data.news = _.take(data.news, 3);
	data.news = data.news.map(function(item) {
		item = _.pick(item, 'id', 'title', 'uniqueName', 'summary', 'imageId', 'publishedAt', 'host', 'path');
		item.summary = utils.wrapAt(item.summary, 500);
		item.publishedAt = (new Date(item.publishedAt)).getTime();
		return item;
	});

	if (data.summary.length < 500) {
		console.log('short summary');
		return null;
	}

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
