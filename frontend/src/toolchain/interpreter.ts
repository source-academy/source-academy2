import * as es from 'estree'
import { List, Stack, Map } from 'immutable'
import { generate } from 'astring'

import { IError } from './types/error'
import { Scope, InterpreterState } from './types/dynamic'
import Closure from './Closure'
import stringifyValue from './utils/stringify'
import * as list from './stdlib/list'
import * as misc from './stdlib/misc'

const MAX_STACK_LIMIT = 500

let frameCtr = 0
let lambdaCtr = 0

export class ExceptionError implements IError {
  constructor(public error: Error, public location: es.SourceLocation) {}

  explain() {
    return this.error.toString()
  }

  elaborate() {
    return 'TODO'
  }
}

export class MaximumStackLimitExceeded implements IError {
  location: es.SourceLocation

  constructor(node: es.Node, private calls: es.CallExpression[]) {
    this.location = node.loc!
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

export class CallingNonFunctionValue implements IError {
  location: es.SourceLocation

  constructor(node: es.Node, private callee: any) {
    this.location = node.loc!
  }

  explain() {
    return `Calling non-function value ${stringifyValue(this.callee)}`
  }

  elaborate() {
    return 'TODO'
  }
}

const importExternal = (m: Map<string, any>, name: string, value: any) => {
  if (typeof value === 'function' && value.toString) {
    value.__SOURCE__ = value.toString()
  }
  m.set(name, value)
}

const createGlobalEnvironment = (week: number) =>
  Map<string, any>().withMutations(m => {
    if (week >= 4) {
      importExternal(m, 'display', misc.display)
      importExternal(m, 'timed', misc.timed)
      // Define all Math libraries
      let objs = Object.getOwnPropertyNames(Math)
      for (let i in objs) {
        const val = objs[i]
        if (typeof Math[val] === 'function') {
          importExternal(m, 'math_' + val, Math[val].bind())
        } else {
          importExternal(m, 'math_' + val, Math[val])
        }
      }
    }
    if (week >= 5) {
      importExternal(m, 'list', list.list)
      importExternal(m, 'pair', list.pair)
      importExternal(m, 'is_pair', list.is_pair)
      importExternal(m, 'is_list', list.is_list)
      importExternal(m, 'is_empty_list', list.is_empty_list)
      importExternal(m, 'head', list.head)
      importExternal(m, 'tail', list.tail)
      importExternal(m, 'length', list.length)
      importExternal(m, 'map', list.map)
      importExternal(m, 'build_list', list.build_list)
      importExternal(m, 'for_each', list.for_each)
      importExternal(m, 'list_to_string', list.list_to_string)
      importExternal(m, 'reverse', list.reverse)
      importExternal(m, 'append', list.append)
      importExternal(m, 'member', list.member)
      importExternal(m, 'remove', list.remove)
      importExternal(m, 'remove_all', list.remove_all)
      importExternal(m, 'equal', list.equal)
      importExternal(m, 'assoc', list.assoc)
      importExternal(m, 'filter', list.filter)
      importExternal(m, 'enum_list', list.enum_list)
      importExternal(m, 'list_ref', list.list_ref)
      importExternal(m, 'accumulate', list.accumulate)

      importExternal(m, 'prompt', prompt)
      importExternal(m, 'parseInt', parseInt)
    }
    importExternal(m, 'alert', alert)
    importExternal(m, 'math_floor', Math.floor)
    importExternal(m, 'math_sqrt', Math.sqrt)
    importExternal(m, 'math_log', Math.log)
    importExternal(m, 'math_exp', Math.exp)
  })

/**
 * Create initial interpreter with global environment.
 *
 * @returns {InterpreterState}
 */
export const createInterpreter = (
  externals: string[],
  week = 3
): InterpreterState => {
  const initialEnv = createGlobalEnvironment(week).withMutations(m => {
    for (const external of externals) {
      m.set(external, (window as any)[external])
    }
  })

  const globalEnv: Scope = {
    name: '_global_',
    parent: undefined,
    environment: initialEnv
  }

  return new InterpreterState({
    _done: false,
    _isReturned: false,
    _result: undefined,
    isRunning: true,
    frames: Stack.of(0),
    scopes: Map.of(0, globalEnv),
    errors: List(),
    value: undefined,
    node: undefined
  })
}

const stop = (state: InterpreterState): InterpreterState =>
  state.with({ isRunning: false })

const start = (state: InterpreterState): InterpreterState =>
  state.with({ isRunning: true })

const defineVariable = (
  state: InterpreterState,
  name: string,
  value: any
): InterpreterState => {
  const currentFrame = state.frames.peek()
  const scope = state.scopes.get(currentFrame)
  return state.with({
    scopes: state.scopes.set(currentFrame, {
      ...scope,
      environment: scope.environment.set(name, value)
    })
  })
}

const popFrame = (state: InterpreterState) =>
  state.with({ frames: state.frames.pop() })

const pushFrame = (state: InterpreterState, scope: Scope) => {
  frameCtr++
  return state.with({
    scopes: state.scopes.set(frameCtr, scope),
    frames: state.frames.push(frameCtr)
  })
}

const getEnv = (name: string, state: InterpreterState) => {
  let scope = state.scopes.get(state.frames.peek())

  do {
    if (scope.environment.has(name)) {
      return scope.environment.get(name)
    } else {
      scope = state.scopes.get(scope.parent!)
    }
  } while (scope)

  return undefined
}

const interopToJS = (value: any) => {
  if (value instanceof Closure) {
    // tslint:disable
    return function() {
      const args: any[] = []
      Array.prototype.forEach.call(arguments, (m: any) => {
        args.push(m)
      })
      const interpreterState = (window as any).CURRENT_INTERPRETER
      const gen = applyClosure(value, args, interpreterState)
      let it = gen.next()
      while (!it.done) {
        it = gen.next()
      }
      return it.value.value
    }
    // tslint:enable
  } else {
    return value
  }
}

export type Evaluator<T extends es.Node> = (
  node: T,
  state: InterpreterState
) => IterableIterator<InterpreterState>

export const evaluators: { [nodeType: string]: Evaluator<any> } = {}
const ev = evaluators

function* applyClosure(
  callee: Closure,
  args: any[],
  state: InterpreterState,
  node?: es.CallExpression
) {
  state = pushFrame(state, callee.createScope(args, node))

  yield (state = state.with({ _done: false, node: callee.node.body }))

  state = yield* ev.BlockStatement(callee.node.body, state)

  yield (state = popFrame(state).with({
    _done: true,
    node,
    _isReturned: false
  }))
  return state
}

ev.FunctionExpression = function*(node: es.FunctionExpression, state) {
  yield (state = state.with({ _done: false, node }))
  const closure = new Closure(node, state.frames.first(), lambdaCtr)
  lambdaCtr++
  yield (state = state.with({ _done: true, node, value: closure }))
  return state
}

ev.Identifier = function*(node: es.Identifier, state) {
  yield (state = state.with({ _done: false, node }))
  yield (state = state.with({
    _done: true,
    node,
    value: getEnv(node.name, state)
  }))
  return state
}

ev.Literal = function*(node: es.Literal, state) {
  yield (state = state.with({ _done: false, node }))
  yield (state = state.with({ _done: true, node, value: node.value }))
  return state
}

ev.ArrayExpression = function*(node: es.ArrayExpression, state) {
  yield (state = state.with({ _done: false, node }))
  yield (state = state.with({ _done: true, node, value: node.elements }))
  return state
}

ev.CallExpression = function*(node: es.CallExpression, state) {
  yield (state = state.with({ _done: false, node }))

  if (state.frames.size > MAX_STACK_LIMIT) {
    const error = new MaximumStackLimitExceeded(
      node,
      state.frames.take(3).map(n => state.scopes.get(n!).callExpression).toJS()
    )
    return state.with({
      isRunning: false,
      errors: state.errors.push(error)
    }) as InterpreterState
  }

  // Evaluate Callee
  state = yield* ev[node.callee.type](node.callee, state)
  const callee = state.value

  // Evaluate each arguments from left to right
  const args: any[] = []
  for (const exp of node.arguments) {
    state = yield* ev[exp.type](exp, state)
    args.push(state.value)
  }

  // Internal Function Call
  if (callee instanceof Closure) {
    state = yield* applyClosure(callee, args, state, node)
    return state
    // Foreign Function Call
  } else if (typeof callee === 'function') {
    let result: any
    try {
      result = callee.apply(window, args.map(interopToJS))
    } catch (e) {
      const error = new ExceptionError(e, node.loc!)
      return state.with({
        isRunning: false,
        errors: state.errors.push(error)
      }) as InterpreterState
    }
    return state.with({
      _done: true,
      node,
      value: result
    })
  } else {
    throw new CallingNonFunctionValue(node, callee)
  }
}

ev.UnaryExpression = function*(node: es.UnaryExpression, state) {
  yield (state = state.with({ _done: false, node }))
  state = yield* ev[node.argument.type](node.argument, state)

  let value
  // tslint:disable-next-line
  if (node.operator === '!') {
    value = !state.value
  } else if (node.operator === '-') {
    value = -state.value
  } else {
    value = +state.value
  }

  yield (state = state.with({ _done: true, node, value }))

  return state
}

ev.BinaryExpression = function*(node: es.BinaryExpression, state) {
  yield (state = state.with({ _done: false, node }))

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

ev.LogicalExpression = function*(node: es.LogicalExpression, state) {
  yield (state = state.with({ _done: false, node }))

  state = yield* ev[node.left.type](node.left, state)
  const left = state.value

  if ((node.operator === '&&' && left) || (node.operator === '||' && !left)) {
    state = yield* ev[node.right.type](node.right, state)
  }

  yield (state = state.with({ _done: true, node }))

  return state
}

ev.ConditionalExpression = function*(node: es.ConditionalExpression, state) {
  yield (state = state.with({ _done: false, node }))
  state = yield* ev[node.test.type](node.test, state)

  state = state.value
    ? yield* ev[node.consequent.type](node.consequent, state)
    : yield* ev[node.alternate.type](node.alternate, state)

  yield (state = state.with({ _done: true, node }))
  return state
}

ev.VariableDeclaration = function*(node: es.VariableDeclaration, state) {
  const declaration = node.declarations[0]
  const id = declaration.id as es.Identifier

  state = yield* ev[declaration.init!.type](declaration.init, state)
  state = defineVariable(state, id.name, state.value)
  return state.with({ value: undefined })
}

ev.FunctionDeclaration = function*(node: es.FunctionDeclaration, state) {
  const id = node.id as es.Identifier
  const closure = new Closure(node as any, state.frames.first())

  state = defineVariable(state, id.name, closure)

  return state.with({ value: undefined })
}

ev.IfStatement = function*(node: es.IfStatement, state) {
  state = yield* ev[node.test.type](node.test, state)

  if (state.value) {
    state = yield* ev[node.consequent.type](node.consequent, state)
  } else if (node.alternate) {
    state = yield* ev[node.alternate.type](node.alternate, state)
  }

  return state
}

ev.ExpressionStatement = function*(node: es.ExpressionStatement, state) {
  return yield* ev[node.expression.type](node.expression, state)
}

ev.ReturnStatement = function*(node: es.ReturnStatement, state) {
  if (node.argument) {
    state = yield* ev[node.argument.type](node.argument, state)
  }
  return state.with({ _isReturned: true })
}

ev.BlockStatement = function*(node: es.BlockStatement, state) {
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

export function* evalProgram(node: es.Program, state: InterpreterState) {
  state = yield* ev.BlockStatement(node as any, start(state))

  return stop(state)
}
