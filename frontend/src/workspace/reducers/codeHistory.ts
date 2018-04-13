import { Reducer } from 'redux'
import { CodeHistory } from '../shape'

const init: CodeHistory = []

const codeHistoryReducer: Reducer<CodeHistory> = (state = init, action) => {
  return state
}

export default codeHistoryReducer
