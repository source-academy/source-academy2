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
  initialState: Shape,
) {
  const isProgramming =
    initialState.config.isPlayground ||
    initialState.config.questionType === 'programming_question'
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

(function() {
  document.body.style.backgroundColor = 'rgb(24, 32, 38)'
  const $workspace = document.querySelector('.sa-workspace') as Element
  const $container = document.querySelector('.sa-main') as Element
  const $solution = (document.querySelector('.sa-solution')
    || document.createElement('textarea'))
  const isPlayground = $workspace.getAttribute('data-playground') === 'true'
  getInitialState(isPlayground).then((state) => {
    // tslint:disable-next-line:no-any
    return initializeWorkspace($solution as any, $container, state)
  })
})()
