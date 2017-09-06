import { Reducer } from 'redux'
import { InterpreterState } from '../shape'
import * as actionTypes from '../actionTypes'

const init: InterpreterState = {
  outputs: []
}

const interpreterReducer: Reducer<InterpreterState> = (
  state = init,
  action
) => {
  switch (action.type) {
    case actionTypes.EVAL_INTERPRETER:
      return {
        ...state,
        outputs: state.outputs.concat([
          {
            type: 'code',
            value: action.payload
          }
        ])
      }
    case actionTypes.CLEAR_INTERPRETER:
    case actionTypes.EVAL_EDITOR:
      return {
        ...state,
        outputs: []
      }
    case actionTypes.CREATE_INTERPRETER_OUTPUT:
      return {
        ...state,
        outputs: state.outputs.concat([
          {
            type: 'log',
            value: action.payload
          }
        ])
      }
    case actionTypes.EVAL_INTERPRETER_SUCCESS:
      return {
        ...state,
        outputs: state.outputs.concat([
          {
            type: 'result',
            value: action.payload
          }
        ])
      }
    case actionTypes.EVAL_INTERPRETER_ERROR:
      return {
        ...state,
        outputs: state.outputs.concat([
          {
            type: 'errors',
            errors: action.payload
          }
        ])
      }
    default:
      return state
  }
}

export default interpreterReducer
