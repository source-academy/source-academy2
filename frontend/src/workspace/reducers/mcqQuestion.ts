import { Reducer } from 'redux'
import { MCQQuestion, MCQChoice } from '../shape'
import * as actionTypes from '../actionTypes'

const init: MCQQuestion = {
  id: 0,
  done: false,
  content: '',
  choices: []
}

const mcqQuestionReducer: Reducer<MCQQuestion> = (state = init, action) => {
  switch (action.type) {
    case actionTypes.SELECT_CHOICE_SUCCESS:
      const result: any = action.payload
      const newChoices: MCQChoice[] = []
      state.choices.forEach(c => {
        newChoices.push({ ...c, selected: false })
      })
      const choice = newChoices.find(c => result.id === c.id)!
      choice.selected = true
      return {
        ...state,
        hint: result.hint,
        done: result.isCorrect,
        choices: newChoices
      }
    default:
      return state
  }
}

export default mcqQuestionReducer
