window.ASSETS_HOST =
  'https://s3-ap-southeast-1.amazonaws.com/source-academy-assets/';
var axios = require('axios')
var StoryXMLPlayer = require('./story-xml-player');
var createInitializer = require('./create-initializer');
var container = document.getElementById('game-display')
var story = window.STORY_OVERRIDE || container.getAttribute('data-story')
var username = container.getAttribute('data-username')
var attemptedAll = container.getAttribute('data-attempted-all') === "true"
var initialize = createInitializer(StoryXMLPlayer, story, username, attemptedAll)
initialize();
