var Constants = require('../constants/constants.js');
var LocationManager = require('../location-manager/location-manager.js');
var DialogManager = require('../dialog-manager/dialog-manager.js');
var MapManager = require('../map-manager/map-manager.js');
var StoryManager = require('../story-manager/story-manager.js');
var SaveManager = require('../save-manager/save-manager.js');
var Utils = require('../utils/utils.js');
var ExternalManager = require('../external-manager/external-manager.js');

var loadedQuests = {};
var activeQuests = {};

function loadQuests(story) {
  if (story.tagName !== 'STORY') {
    return;
  }
  var quests = {};
  loadedQuests[story.id] = quests;
  var child = story.children[0];
  while (child) {
    // check whether child is a <QUEST>
    if (child.tagName == 'QUEST') {
      quests[child.id] = child;
    }
    child = child.nextElementSibling;
  }
}
module.exports.loadQuests = loadQuests;

function unloadQuests(storyId) {
  loadedQuests[storyId] = null;
  activeQuests[storyId] = null;
}
module.exports.unloadQuests = unloadQuests;

function playCompleteQuest(node, callback) {
  if (node.tagName != 'COMPLETE_QUEST') {
    return;
  }
  var storyAncestor = Utils.getStoryAncestor(node);
  completeQuest(storyAncestor.id, node.textContent, callback);
}
module.exports.playCompleteQuest = playCompleteQuest;

function playUnlockQuest(node, callback) {
  if (node.tagName != 'UNLOCK_QUEST') {
    return;
  }
  var storyAncestor = Utils.getStoryAncestor(node);
  unlockQuest(storyAncestor.id, node.textContent, callback);
}
module.exports.playUnlockQuest = playUnlockQuest;

function unlockQuest(storyId, questId, callback) {
  callback = callback || Constants.nullFunction;
  var quests = loadedQuests[storyId];
  if (!quests) {
    return;
  }
  var quest = quests[questId];
  if (!quest) {
    return;
  }
  // check whether this quest is already active
  if (activeQuests[storyId] && activeQuests[storyId][questId]) {
    callback();
    return;
  }
  if (!activeQuests[storyId]) {
    activeQuests[storyId] = {};
  }
  // apply effects first
  applyEffects(quest.children[0]);
  SaveManager.saveUnlockQuest(storyId, questId);
  activeQuests[storyId][questId] = quest;
  // play the opening sequence
  playOpening(storyId, questId, callback);
}
module.exports.unlockQuest = unlockQuest;

function playOpening(storyId, questId, callback) {
  if (!activeQuests[storyId][questId]) {
    return;
  }
  callback = callback || Constants.nullFunction;
  var quest = activeQuests[storyId][questId];
  DialogManager.playSequence(quest.children[1], function() {
    SaveManager.unmarkPending();
    var child = quest.children[2];
    function nextAction(child) {
      if (!child) {
        callback();
        return;
      }
      if (child.tagName == 'COMPLETE_QUEST') {
        playCompleteQuest(child, function() {
          nextAction(child.nextElementSibling);
        });
      } else if (child.tagName == 'UNLOCK_QUEST') {
        playUnlockQuest(child, function() {
          nextAction(child.nextElementSibling);
        });
      } else if (child.tagName == 'EXTERNAL_ACTION') {
        ExternalManager.playExternalAction(child);
        nextAction(child.nextElementSibling);
      } else if (child.tagName == 'CHANGE_START_LOCATION') {
        LocationManager.changeStartLocation(child.textContent);
        nextAction(child.nextElementSibling);
      } else {
        nextAction(child.nextElementSibling);
      }
    }
    nextAction(child);
  });
}
module.exports.playOpening = playOpening;

function completeQuest(storyId, questId, callback) {
  callback = callback || Constants.nullFunction;
  if (!activeQuests[storyId] || !activeQuests[storyId][questId]) {
    return;
  }
  if (!activeQuests[storyId][questId].nextElementSibling) {
    // last quest, close this story
    StoryManager.closeStory(storyId, callback);
    return;
  }
  var quest = activeQuests[storyId][questId];
  var needUpdate = quest.children[0].children.length > 0;
  activeQuests[storyId][questId] = null;
  if (needUpdate) {
    LocationManager.goBackToCurCamLocation(callback, function() {
      SaveManager.removeActions({ storyId: storyId, questId: questId }, true);
    });
  } else {
    SaveManager.removeActions({ storyId: storyId, questId: questId }, false);
    callback();
  }
}
module.exports.completeQuest = completeQuest;

function unlockLastQuest(storyId, callback) {
  callback = callback || Constants.nullFunction;
  var story = StoryManager.getLoadedStory(storyId);
  if (!story) {
    return;
  }
  var lastChild = story.children[story.children.length - 1];
  if (lastChild && lastChild.tagName == 'QUEST') {
    unlockQuest(storyId, lastChild.id, callback);
  }
}
module.exports.unlockLastQuest = unlockLastQuest;

function applyEffects(node) {
  if (node.tagName != 'EFFECTS') {
    return;
  }
  var child = node.children[0];
  while (child) {
    if (child.tagName != 'LOCATION') {
      return;
    }
    MapManager.processEffectsLocation(child);
    child = child.nextElementSibling;
  }
}

// this is for when loading saved game or updating game state, it does not trigger opening sequence like unlockQuest
function activateQuest(storyId, questId) {
  var quest = loadedQuests[storyId][questId];
  // register this quest as active
  activeQuests[storyId] = activeQuests[storyId] || {};
  activeQuests[storyId][questId] = quest;
  applyEffects(quest.children[0]);
}
module.exports.activateQuest = activateQuest;
