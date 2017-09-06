import { Reducer } from 'redux'
import { CommentState } from '../shape'
import * as actionTypes from '../actionTypes'

const init: CommentState = {
  comments: [],
  newComment: ''
}

const commentsReducer: Reducer<CommentState> = (state = init, action) => {
  switch (action.type) {
    case actionTypes.CREATE_COMMENT_SUCESS:
      return {
        ...state,
        newComment: '',
        comments: state.comments.concat([action.payload])
      }
    case actionTypes.SET_NEW_COMMENT_VALUE:
      return {
        ...state,
        newComment: action.payload
      }
    default:
      return state
  }
}

export default commentsReducer
