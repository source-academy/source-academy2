import { Reducer } from 'redux'
import { DebugState } from '../shape'
import * as actionTypes from '../actionTypes'

const init: DebugState = {
  elapsed: 0,
  isRunning: false
}

const debugReducer: Reducer<DebugState> = (state = init, action) => {
  switch (action.type) {
    case actionTypes.EVAL_EDITOR:
    case actionTypes.EVAL_INTERPRETER:
      return {
        ...state,
        isRunning: true
      }
    case actionTypes.INTERRUPT_EXECUTION:
    case actionTypes.EVAL_INTERPRETER_SUCCESS:
    case actionTypes.EVAL_INTERPRETER_ERROR:
      return {
        ...state,
        isRunning: false
      }
    default:
      return state
   }
}

export default debugReducer
