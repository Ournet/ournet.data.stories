/*eslint no-underscore-dangle:1*/

'use strict';

var core = require('ournet.core');
var Promise = core.Promise;
var _ = core._;
var internal = {};
var external = module.exports;
var elasticsearch = require('elasticsearch');
var ES_STORIES_INDEX = 'stories';
var ES_STORIES_TYPE = 'story';

var client = new elasticsearch.Client({
  host: process.env.WEBDATA_ES_HOST
});

Promise.promisifyAll(client);

/**
 * Create a story in elastic search
 */
external.createStory = function(data) {
  var story = internal.normalizeStory(data);

  return client.indexAsync({
    index: ES_STORIES_INDEX,
    type: ES_STORIES_TYPE,
    id: story.id,
    body: story,
    ttl: '90d'
  });
};

/**
 * Update a story
 */
external.updateStory = function(id, data) {
  // console.log('updating story', id, data);
  return client.updateAsync({
    index: ES_STORIES_INDEX,
    type: ES_STORIES_TYPE,
    id: id,
    doc: data,
    body: {
      doc: data
    }
  });
};

/**
 * Search stories
 */
external.searchStories = function(params) {
  var q = core.text.atonic(params.q);
  var body = {
    'query': {
      'filtered': {
        'filter': {
          'bool': {
            'must': [{
              'term': {
                'country': params.country
              }
            }, {
              'term': {
                'lang': params.lang
              }
            }]
          }
        },
        'query': {
          'multi_match': {
            'query': q,
            'fields': ['title', 'title_' + params.lang]
          }
        }
      }
    }
  };
  if (params.min_score) {
    body.min_score = params.min_score;
  }
  // if (params.ignoreId) {
  //   body.query.filtered.filter.not = {
  //     _id: params.ignoreId
  //   };
  // }

  return client.searchAsync({
    index: ES_STORIES_INDEX,
    type: ES_STORIES_TYPE,
    body: body
  }).then(internal.getStories);
};

internal.normalizeStory = function(data) {
  var story = _.pick(data, 'id', 'title', 'uniqueName', 'country', 'lang', 'createdAt', 'imageId');
  story['title_' + story.lang] = core.text.atonic(story.title);

  return story;
};

internal.getStories = function(response) {
  var items = [];
  //console.log(response[0].hits);
  if (response[0].hits && response[0].hits.total > 0) {
    response[0].hits.hits.forEach(function(item) {
      items.push(item._source);
    });
  }

  return items;
};
