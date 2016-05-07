'use strict';

var Data = require('./common/data');
if (!Data) {
	return;
}

var assert = require('assert');

describe('Access', function() {
	it('should get story by id', function() {
		return Data.access.story(283452)
			.then(function(item) {
				assert.ok(item);
				assert.equal('ro', item.lang);
			});
	});
	it('should get story by id (AttributesToGet)', function() {
		return Data.access.story(283452, {
				params: {
					AttributesToGet: ['id', 'title']
				}
			})
			.then(function(item) {
				assert.ok(item);
				assert.equal(283452, item.id);
				assert.equal(2, Object.keys(item).length);
			});
	});
	it('should get stories by ids', function() {
		return Data.access.stories([283452])
			.then(function(items) {
				assert.ok(items);
				assert.equal(1, items.length);
			});
	});
	it('#importantStoriesIds', function() {
		return Data.access.importantStoriesIds('ru_ru')
			.then(function(ids) {
				assert.ok(ids);
				assert.equal(true, ids.length > 0);
			});
	});
});
