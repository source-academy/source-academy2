import * as es from 'estree'
import { generate } from 'astring'

import { SourceError } from './types/error'
import { Scope, InterpreterState as State, Value } from './types/dynamic'
import Closure from './Closure'
import stringifyValue from './utils/stringify'
import createGlobalEnvironment from './utils/createGlobalEnvironment'
import sourceValueToJS from './utils/sourceValueToJS'

const MAX_STACK_LIMIT = 500
const UNKNOWN_LOCATION: es.SourceLocation = {
  start: {
    line: -1,
    column: -1,
  },
  end: {
    line: -1,
    column: -1
  }
}

export class ExceptionError implements SourceError {
  constructor(public error: Error, public location: es.SourceLocation) {}

  explain() {
    return this.error.toString()
  }

  elaborate() {
    return 'TODO'
  }
}

export class MaximumStackLimitExceeded implements SourceError {
  location: es.SourceLocation

  constructor(node: es.Node, private calls: es.CallExpression[]) {
    this.location = node ? node.loc! : UNKNOWN_LOCATION
  }

  explain() {
    return `
      Infinite recursion
      ${generate(this.calls[0])}..${generate(this.calls[1])}..${generate(
      this.calls[2]
    )}..
    `
  }

  elaborate() {
    return 'TODO'
  }
}

export class CallingNonFunctionValue implements SourceError {
  location: es.SourceLocation

  constructor(node: es.Node, private callee: Value) {
    this.location = node.loc!
  }

  explain() {
    return `Calling non-function value ${stringifyValue(this.callee)}`
  }

  elaborate() {
    return 'TODO'
  }
}

export class UndefinedVariable implements SourceError {
  location: es.SourceLocation

  constructor(public name: string, node: es.Node) {
    this.location = node.loc!
  }

  explain() {
    return `Undefined Variable ${this.name}`
  }

  elaborate() {
    return 'TODO'
  }
}

const stop = (state: State) => {
  state.isRunning = false
  return state
}

const start = (state: State) => {
  state.isRunning = true
  return state
}

const defineVariable = (state: State, name: string, value: any) => {
  const currentScope = state.stack[0]
  currentScope.environment[name] = value
  return state
}

const popFrame = (state: State) => {
  state.stack.shift()
  return state
}

const pushFrame = (state: State, scope: Scope) => {
  state.stack.unshift(scope)
  return state
}

const getEnv = (name: string, state: State) => {
  let idx = 0
  let scope = state.stack[idx]
  while (scope) {
    if (scope.environment.hasOwnProperty(name)) {
      return scope.environment[name]
    } else {
      scope = state.stack[++idx]
    }
  }
  throw new UndefinedVariable(name, state.node!)
}

export type Evaluator<T extends es.Node> = (
  node: T,
  state: State
) => IterableIterator<State>

export const evaluators: { [nodeType: string]: Evaluator<{}> } = {}
const ev = evaluators

function* moveTo(node: es.Node, state: State) {
  state._done = false
  state.node = node
  yield state
}

function* done(node: es.Node, state: State) {
  state._done = true
  state.node = node
  yield state
}

export function* apply(
  callee: Closure | Value,
  args: {}[],
  state: State,
  node: es.CallExpression
) {
  if (callee instanceof Closure) {
    if (state.stack.length > MAX_STACK_LIMIT) {
      const stacks = state.stack.slice(0, 3).map(s => s.callExpression as es.CallExpression)
      throw new MaximumStackLimitExceeded(
        node,
        stacks
      )
    }
    yield* moveTo(callee.node.body, state)
    pushFrame(state, callee.createScope(args, node))
    yield* ev.BlockStatement(callee.node.body, state)
    popFrame(state)
    state._isReturned = false
    return state
  } else if (typeof callee === 'function') {
    let result: Value
    try {
      result = callee.apply(window, args.map(a => sourceValueToJS(state, a)))
    } catch (e) {
      // Recover from exception
      state.stack = [state.stack[0]]
      throw new ExceptionError(e, node.loc!)
    }
    state.value = result
    return state
  } else {
    throw new CallingNonFunctionValue(node, callee)
  }
}

ev.FunctionExpression = function*(node: es.FunctionExpression, state: State) {
  yield* moveTo(node, state)
  state.value = new Closure(node, state.stack[0])
  yield* done(node, state)
  return state
}

ev.Identifier = function*(node: es.Identifier, state: State) {
  yield* moveTo(node, state)
  state.value = getEnv(node.name, state)
  yield* done(node, state)
  return state
}

ev.Literal = function*(node: es.Literal, state: State) {
  yield* moveTo(node, state)
  state.value = node.value
  yield* done(node, state)
  return state
}

ev.ArrayExpression = function*(node: es.ArrayExpression, state: State) {
  yield* moveTo(node, state)
  state.value = node.elements
  yield* done(node, state)
  return state
}

ev.CallExpression = function*(node: es.CallExpression, state: State) {
  yield* moveTo(node, state)

  if (state.stack.length > MAX_STACK_LIMIT) {
    const stacks = state.stack.slice(0, 3).map(s => generate(s.callExpression))
    throw new MaximumStackLimitExceeded(
      node,
      stacks
    )
  }

  // Evaluate Callee
  state = yield* ev[node.callee.type](node.callee, state)
  const callee = state.value

  // Evaluate each arguments from left to right
  const args: {}[] = []
  for (const exp of node.arguments) {
    state = yield* ev[exp.type](exp, state)
    args.push(state.value)
  }
  state = yield* apply(callee, args, state, node)
  yield* done(node, state)
  return state
}

ev.UnaryExpression = function*(node: es.UnaryExpression, state: State) {
  yield* moveTo(node, state)

  // Evaluate argument
  state = yield* ev[node.argument.type](node.argument, state)

  let value
  if (node.operator === '!') {
    value = !state.value
  } else if (node.operator === '-') {
    value = -state.value
  } else {
    value = +state.value
  }

  yield* done(node, state)
  return state
}

ev.BinaryExpression = function*(node: es.BinaryExpression, state: State) {
  yield* moveTo(node, state)

  state = yield* ev[node.left.type](node.left, state)
  const left = state.value
  state = yield* ev[node.right.type](node.right, state)
  const right = state.value

  let result
  switch (node.operator) {
    case '+':
      result = left + right
      break

    case '-':
      result = left - right
      break
    case '*':
      result = left * right
      break
    case '/':
      result = left / right
      break
    case '%':
      result = left % right
      break
    case '===':
      result = left === right
      break
    case '!==':
      result = left !== right
      break
    case '<=':
      result = left <= right
      break
    case '<':
      result = left < right
      break
    case '>':
      result = left > right
      break
    case '>=':
      result = left >= right
      break
    default:
      result = undefined
  }

  yield (state = state.with({ _done: true, node, value: result }))

  return state
}

ev.LogicalExpression = function*(node: es.LogicalExpression, state: State) {
  yield (state = state.with({ _done: false, node }))

  state = yield* ev[node.left.type](node.left, state)
  const left = state.value

  if ((node.operator === '&&' && left) || (node.operator === '||' && !left)) {
    state = yield* ev[node.right.type](node.right, state)
  }

  yield (state = state.with({ _done: true, node }))

  return state
}

ev.ConditionalExpression = function*(node: es.ConditionalExpression, state: State) {
  yield (state = state.with({ _done: false, node }))
  state = yield* ev[node.test.type](node.test, state)

  state = state.value
    ? yield* ev[node.consequent.type](node.consequent, state)
    : yield* ev[node.alternate.type](node.alternate, state)

  yield (state = state.with({ _done: true, node }))
  return state
}

ev.VariableDeclaration = function*(node: es.VariableDeclaration, state: State) {
  const declaration = node.declarations[0]
  const id = declaration.id as es.Identifier

  state = yield* ev[declaration.init!.type](declaration.init, state)
  state = defineVariable(state, id.name, state.value)
  return state.with({ value: undefined })
}

ev.FunctionDeclaration = function*(node: es.FunctionDeclaration, state: State) {
  const id = node.id as es.Identifier
  const closure = new Closure(node as {}, state.frames.first())

  state = defineVariable(state, id.name, closure)

  return state.with({ value: undefined })
}

ev.IfStatement = function*(node: es.IfStatement, state: State) {
  state = yield* ev[node.test.type](node.test, state)

  if (state.value) {
    state = yield* ev[node.consequent.type](node.consequent, state)
  } else if (node.alternate) {
    state = yield* ev[node.alternate.type](node.alternate, state)
  }

  return state
}

ev.ExpressionStatement = function*(node: es.ExpressionStatement, state: State) {
  return yield* ev[node.expression.type](node.expression, state)
}

ev.ReturnStatement = function*(node: es.ReturnStatement, state: State) {
  if (node.argument) {
    state = yield* ev[node.argument.type](node.argument, state)
  }
  return state.with({ _isReturned: true })
}

ev.BlockStatement = function*(node: es.BlockStatement, state: State) {
  for (const statement of node.body) {
    yield (state = state.with({ _done: false, node: statement }))
    state = yield* ev[statement.type](statement, state)
    if (state._isReturned) {
      break
    }
  }
  const insideFunction = state.frames.size > 1
  const value = insideFunction && !state._isReturned ? undefined : state.value
  state = state.with({ value, _isReturned: state._isReturned })
  return state
}

/**
 * Create initial interpreter with global environment.
 *
 * @returns {State}
 */
export const createInterpreter = (
  externals: string[],
  week = 3
): State => {
  const globalEnv = createGlobalEnvironment(week)
  for (const external of externals) {
    globalEnv[external] = window[external]
  }
  return new State(globalEnv)
}

export function* evalProgram(node: es.Program, state: State) {
  state = yield* ev.BlockStatement(node as {}, start(state))

  return stop(state)
}
