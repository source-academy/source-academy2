import { IError } from '../toolchain/types/error'
import { Comment } from './shape'
import * as actionTypes from './actionTypes'

export const setFilename = (filename: string) => ({
  type: actionTypes.SET_FILENAME,
  payload: filename
})

export const setReadOnly = (to: boolean) => ({
  type: actionTypes.SET_READ_ONLY,
  payload: to
})

export const setLayoutType = (type: 'split' | 'editor-only' | 'side-only') => ({
  type: actionTypes.SET_LAYOUT_TYPE,
  payload: type
})

export const setActiveTab = (tab: string) => ({
  type: actionTypes.SET_ACTIVE_TAB,
  payload: tab
})

export const setEditorValue = (code: string) => ({
  type: actionTypes.SET_EDITOR_VALUE,
  payload: code
})

export const evalEditor = () => ({ type: actionTypes.EVAL_EDITOR })

export const evalInterpreter = (code: string) => ({
  type: actionTypes.EVAL_INTERPRETER,
  payload: code
})

export const evalInterpreterSuccess = (value: any) => ({
  type: actionTypes.EVAL_INTERPRETER_SUCCESS,
  payload: value
})

export const evalInterpreterError = (errors: IError[]) => ({
  type: actionTypes.EVAL_INTERPRETER_ERROR,
  payload: errors
})

export const saveEditor = () => ({
  type: actionTypes.SAVE_EDITOR
})

export const saveEditorSuccess = () => ({
  type: actionTypes.SAVE_EDITOR_SUCCESS
})

export const clearInterpreter = () => ({ type: actionTypes.CLEAR_INTERPRETER })

export const setLibrarySuccess = () => ({
  type: actionTypes.SET_LIBRARY_SUCCESS
})

export const setLibrary = (title: string) => ({
  type: actionTypes.SET_LIBRARY,
  payload: title
})

export const setNewCommentValue = (content: string) => ({
  type: actionTypes.SET_NEW_COMMENT_VALUE,
  payload: content
})

export const createComment = () => ({
  type: actionTypes.CREATE_COMMENT
})

export const createCommentSuccess = (comment: Comment) => ({
  type: actionTypes.CREATE_COMMENT_SUCESS,
  payload: comment
})

export const selectChoice = (id: number) => ({
  type: actionTypes.SELECT_CHOICE,
  payload: id
})

export const selectChoiceSuccess = (payload: any) => ({
  type: actionTypes.SELECT_CHOICE_SUCCESS,
  payload
})
