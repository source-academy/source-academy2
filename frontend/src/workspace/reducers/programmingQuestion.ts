import { Reducer } from 'redux'
import { ProgrammingQuestion } from '../shape'
import * as actionTypes from '../actionTypes'

const init: ProgrammingQuestion = {
  id: 0,
  content: '',
  tests: [],
  marks: 0,
  maxMarks: 0
}

const programmingQuestionReducer: Reducer<ProgrammingQuestion> = (
  state = init,
  action
) => {
  switch (action.type) {
    case actionTypes.RUN_TESTS_SUCCESS:
      return state
    default:
      return state
  }
}

export default programmingQuestionReducer
