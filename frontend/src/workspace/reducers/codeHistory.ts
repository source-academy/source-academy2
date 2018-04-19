import { Reducer } from 'redux'
import { CodeHistory } from '../shape'
import * as actionTypes from '../actionTypes'

const init: CodeHistory = []

const codeHistoryReducer: Reducer<CodeHistory> = (state = init, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_CODE_HISTORY:
      return action.payload
  }
  return state
}

export default codeHistoryReducer
