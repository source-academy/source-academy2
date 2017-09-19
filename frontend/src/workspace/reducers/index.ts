import { combineReducers } from 'redux'

import config from './config'
import interpreter from './interpreter'
import editor from './editor'
import comments from './comments'
import mcqQuestion from './mcqQuestion'
import programmingQuestion from './programmingQuestion'
import debug from './debug'

export default combineReducers({
  config,
  interpreter,
  editor,
  comments,
  mcqQuestion,
  programmingQuestion,
  debug
})
