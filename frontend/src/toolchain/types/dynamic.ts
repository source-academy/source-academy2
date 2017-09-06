import * as es from 'estree'
import { Stack, List, Map, Record } from 'immutable'

import { IError } from './error'

export interface Scope {
  parent?: number
  callExpression?: es.CallExpression
  name: string
  environment: Map<string, any>
}

export interface InspectableState {
  node?: es.Node
  value?: any
  _done: boolean
}

const params = {
  isRunning: false,
  frames: Stack<number>(),
  scopes: Map<number, Scope>(),
  errors: List<IError>(),
  node: undefined,
  value: undefined,

  _isReturned: false,
  _done: false
}

export class InterpreterState extends Record(params)
  implements InspectableState {
  isRunning: boolean
  frames: Stack<number>
  scopes: Map<number, Scope>
  errors: List<IError>
  value?: any
  node?: es.Node

  // tslint:disable:variable-name
  _isReturned?: boolean
  _done: boolean

  with(newParams: Partial<InterpreterState>) {
    let newState
    if (Array.isArray(newParams.value)) {
      const val = newParams.value.slice()
      delete newParams.value
      newState = this.merge(newParams).set('value', val)
    } else {
      newState = this.merge(newParams)
    }
    ;(window as any).CURRENT_INTERPRETER = newState
    return newState
  }
}
