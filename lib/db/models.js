'use strict';

var vogels = require('vogels-helpers');
var schemas = require('./schemas');
var Story = require('./story');

exports.Story = vogels.define('Story', {
	tableName: 'Stories',
	hashKey: 'id',
	// createdAt, updatedAt
	timestamps: true,
	schema: schemas.Story,
	indexes: [{
		hashKey: 'importantKey',
		rangeKey: 'createdAt',
		type: 'global',
		name: 'importantStories-index'
	}]
}, Story.config);

exports.TopicStory = vogels.define('TopicStory', {
	tableName: 'TopicStories',
	hashKey: 'topicId',
	rangeKey: 'storyId',
	timestamps: false,
	schema: schemas.TopicStory
});
