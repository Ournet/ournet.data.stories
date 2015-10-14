'use strict';

var core = require('ournet.core');
var _ = core._;

function createSummaryPrefix(text) {
	text = text.trim().substr(0, 100).toLowerCase();
	text = core.text.atonic(text).replace(/[\s\.;,\?\/\\!:@#$%^&\*]+/gi, ' ').trim().replace(/ {2,}/gi, ' ');
	return text;
}

exports.normalizeStory = function(data) {
	data = _.pick(data, 'id', 'title', 'summary', 'uniqueName', 'host', 'path', 'countNews', 'countViews', 'countQuotes', 'countVideos', 'webpageId', 'lang', 'country', 'createdAt', 'imageId', 'imageHost', 'news', 'topics', 'videos', 'quotes', 'category');
	data.culture = [data.country, data.lang].join('_');
	data.topics = data.topics || [];
	if (data.topics) {
		data.topics = data.topics.map(function(topic) {
			return core.util.clearObject(_.pick(topic, 'id', 'name', 'uniqueName', 'abbr', 'key', 'wikiId', 'type', 'category'));
		});
		data.topics = _.uniq(data.topics, 'id');
		//data.topics = _.uniq(data.topics, 'uniqueName');
	}
	if (data.topics.length === 0) {
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

	data.news = _.take(data.news, 3);
	data.news = data.news.map(function(item) {
		item = _.pick(item, 'id', 'title', 'uniqueName', 'summary', 'imageId', 'publishedAt', 'host', 'path');
		item.summary = core.text.wrapAt(item.summary, 500);
		item.publishedAt = (new Date(item.publishedAt)).getTime();
		return item;
	});

	if (data.news.length === 0 && data.summary.length < 500) {
		return null;
	}

	data.videos = data.videos || [];

	data.videos = _.uniq(data.videos);

	data.countVideos = data.videos.length;
	data.quotes = data.quotes || [];
	data.countQuotes = data.quotes.length;

	return core.util.clearObject(data);
};

exports.get = function(data) {
	if (_.isNull(data) || _.isUndefined(data)) {
		return data;
	}
	if (_.isArray(data)) {
		return data.map(exports.get);
	}
	if (_.isFunction(data.toJSON)) {
		return data.toJSON();
	}
	if (_.isObject(data)) {
		Object.keys(data).forEach(function(key) {
			data[key] = exports.get(data[key]);
		});
	}
	return data;
};
