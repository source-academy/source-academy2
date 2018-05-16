import { Reducer } from 'redux'
import { Config } from '../shape'
import * as actionTypes from '../actionTypes'

const init: Config = {
  filename: '',
  isReadOnly: false,
  isPlayground: false,
  activeLayout: 'split',
  libraries: [],
  activeTab: 'interpreter',
  library: {
    title: 'Source §1',
    externals: [],
    week: 3,
    files: [],
    globals: []
  }
}

const configReducer: Reducer<Config> = (state = init, action) => {
  switch (action.type) {
    case actionTypes.SET_FILENAME:
      return { ...state, filename: action.payload }
    case actionTypes.SET_READ_ONLY:
      return { ...state, isReadOnly: action.payload }
    case actionTypes.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload }
    case actionTypes.SET_LAYOUT_TYPE:
      return { ...state, activeLayout: action.payload }
    case actionTypes.SET_LIBRARY:
      const newLibrary = state.libraries.find(n => n.title === action.payload)
      return { ...state, library: newLibrary || state.library }
    default:
      return state
  }
}

export default configReducer
