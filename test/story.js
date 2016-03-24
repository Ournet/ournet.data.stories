'use strict';

var Story = require('../lib/db/story');
var assert = require('assert');

describe('Story', function() {
	it('should normalize a story', function() {
		var story = Story.normalizeStory({
			country: 'ro',
			lang: 'ro',
			category: 1
		});
		assert.equal(null, story);

		story = Story.normalizeStory({
			country: 'ro',
			lang: 'ro',
			category: 1,
			summary: 'Some quote kjvdfs jdjjsdsjdsjkjksdgj dfg dfjsgjdsfh gjksdfg df Some quote kjvdfs jdjjsdsjdsjkjksdgj dfg dfjsgjdsfh gjksdfg df Some quote kjvdfs jdjjsdsjdsjkjksdgj dfg dfjsgjdsfh gjksdfg df h fjdsfdjsfdjsgu erhgu erh djfgjkdfsg jdfhgjk dflskg ksdfhjkg dfhsjkg jdsfhgjhfd jkgsdfj jfsdjg sd gljdhgjhasghauerhg iuerhg jdfhgjdfhsjgldfs ghdf gjhdf gdsfjg dsfgkldsf gsfdhfghfg hghghj gjg jgjg j gg ug ugiujhjljlhjlh jlj jhj jg hjghj gjghg hj gjklj lhh hjhljk gjlj uguyg ygyogu gugkjljl jjk ljljlgjgljg jgjg j gjgjjk j gjl j gj',
			title: 'Some title',
			host: 'news.com',
			path: '/',
			topics: [{ id: 10 }],
			news: [{
				id: 2323,
				summary: 'Summary'
			}]
		});
		assert.equal('string', typeof story.title);
		// assert.equal('string', typeof story.textHash);
	});
});
