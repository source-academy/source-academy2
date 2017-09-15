import * as es from 'estree'
import { SourceError } from './error'

// tslint:disable:no-any
export type Environment = {[name: string]: any}
export type Value = any
// tslint:enable:no-any

export interface Scope {
  name: string
  parent: Scope | null
  callExpression?: es.CallExpression
  environment: Environment
}

export class InterpreterState {
  isRunning: boolean = false
  stack: Scope[] = []
  errors: SourceError[] = []
  value?: Value
  node?: es.Node
  _isReturned? = false
  _done = false

  constructor(globalEnv: Environment) {
    this.stack.push({
      parent: null,
      name: '_global_',
      environment: globalEnv
    })
  }
}
