import { Reducer } from 'redux'
import { EditorState } from '../shape'
import * as actionTypes from '../actionTypes'

const init: EditorState = {
  value: '',
  isDirty: false
}

const editorReducer: Reducer<EditorState> = (state = init, action) => {
  switch (action.type) {
    case actionTypes.SAVE_EDITOR_SUCCESS:
      return {
        ...state,
        isDirty: false
      }
    case actionTypes.SET_EDITOR_VALUE:
      return {
        ...state,
        value: action.payload,
        isDirty: true
      }
    default:
      return state
  }
}

export default editorReducer
