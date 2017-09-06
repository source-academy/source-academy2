import { Reducer } from 'redux'
import { EditorState } from '../shape'
import * as actionTypes from '../actionTypes'

const init: EditorState = {
  value: ''
}

const editorReducer: Reducer<EditorState> = (state = init, action) => {
  switch (action.type) {
    case actionTypes.SET_EDITOR_VALUE:
      return {
        ...state,
        value: action.payload
      }
    default:
      return state
  }
}

export default editorReducer
