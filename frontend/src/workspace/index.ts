/// <reference path="workspace.ambient.d.ts" />

import * as React from 'react'
import { render } from 'react-dom'

import WorkspaceContainer from './components/WorkspaceContainer'
import createStore from './createStore'
import { Shape } from './shape'
import ProgrammingWorkspace from './components/ProgrammingWorkspace'
import MCQWorkspace from './components/MCQWorkspace'
import getInitialState from './util/getInitialState'

async function initializeWorkspace(
  $solution: HTMLTextAreaElement,
  $container: Element,
  initialState: Partial<Shape> = {},
  isProgramming = true
) {
  const store = await createStore(initialState)
  window.__REDUX_STORE__ = store
  const workspaceContainer = React.createFactory(WorkspaceContainer)
  if (isProgramming) {
    const programmingWorkspace = React.createElement(ProgrammingWorkspace)
    render(workspaceContainer({ store }, programmingWorkspace), $container)
  } else {
    const mcqWorkspace = React.createElement(MCQWorkspace)
    render(workspaceContainer({ store }, mcqWorkspace), $container)
  }
}

;(function(exports: any) {
  exports.initializeWorkspace = async (
    $solution: HTMLTextAreaElement,
    isPlayground = false
  ) => {
    document.body.style.backgroundColor = 'rgb(24, 32, 38)'
    const $container = document.querySelector('.sa-main') as Element
    $solution = $solution || document.createElement('textarea')
    const state: Shape = await getInitialState(isPlayground)
    const isProgramming =
      state.config.isPlayground ||
      state.config.questionType === 'programming_question'
    initializeWorkspace($solution, $container, state, isProgramming)
  }
})(window)
