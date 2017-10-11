import * as es from 'estree'
import {
  Closure,
  Frame,
  Value,
  Context,
  SourceError,
  ErrorSeverity
} from './types'
import { toJS } from './interop'
import { createNode } from './utils/node'
import * as constants from './constants'
import * as rttc from './utils/rttc'
import * as errors from './interpreter-errors'

class ReturnValue {
  constructor(public value: Value) {}
}

class TailCallReturnValue {
  constructor(
    public callee: Closure,
    public args: Value[],
    public node: es.CallExpression
  ) {}
}

const createFrame = (
  closure: Closure,
  args: Value[],
  callExpression?: es.CallExpression
): Frame => {
  const frame: Frame = {
    name: closure.name, // TODO: Change this
    parent: closure.frame,
    environment: {}
  }
  if (callExpression) {
    frame.callExpression = {
      ...callExpression,
      arguments: callExpression.arguments.map(
        a => createNode(a) as es.Expression
      )
    }
  }
  closure.node.params.forEach((param, index) => {
    const ident = param as es.Identifier
    frame.environment[ident.name] = args[index]
  })
  return frame
}

const handleError = (context: Context, error: SourceError) => {
  context.errors.push(error)
  if (error.severity === ErrorSeverity.ERROR) {
    const globalFrame =
      context.runtime.frames[context.runtime.frames.length - 1]
    context.runtime.frames = [globalFrame]
    throw error
  } else {
    return context
  }
}

function defineVariable(context: Context, name: string, value: Value) {
  const frame = context.runtime.frames[0]

  if (frame.environment.hasOwnProperty(name)) {
    handleError(
      context,
      new errors.VariableRedeclaration(context.runtime.nodes[0]!, name)
    )
  }

  frame.environment[name] = value

  return frame
}
function* visit(context: Context, node: es.Node) {
  context.runtime.nodes.unshift(node)
  yield context
}
function* leave(context: Context) {
  context.runtime.nodes.shift()
  yield context
}
const currentFrame = (context: Context) => context.runtime.frames[0]
const replaceFrame = (context: Context, frame: Frame) =>
  (context.runtime.frames[0] = frame)
const popFrame = (context: Context) => context.runtime.frames.shift()
const pushFrame = (context: Context, frame: Frame) =>
  context.runtime.frames.unshift(frame)

const getVariable = (context: Context, name: string) => {
  let frame: Frame | null = context.runtime.frames[0]
  while (frame) {
    if (frame.environment.hasOwnProperty(name)) {
      return frame.environment[name]
    } else {
      frame = frame.parent
    }
  }
  handleError(
    context,
    new errors.UndefinedVariable(name, context.runtime.nodes[0])
  )
}

const setVariable = (context: Context, name: string, value: any) => {
  let frame: Frame | null = context.runtime.frames[0]
  while (frame) {
    if (frame.environment.hasOwnProperty(name)) {
      frame.environment[name] = value
      return
    } else {
      frame = frame.parent
    }
  }
  handleError(
    context,
    new errors.UndefinedVariable(name, context.runtime.nodes[0])
  )
}

const checkCallStackSize = (context: Context, node: es.CallExpression) => {
  const currentStackSize = context.runtime.frames.length
  // Check for max call stack
  if (node && currentStackSize > constants.MAX_STACK_LIMIT) {
    const stacks = context.runtime.frames
      .slice(0, 3)
      .map(s => s.callExpression as es.CallExpression)
    const error = new errors.MaximumStackLimitExceeded(node, stacks)
    handleError(context, error)
  }
}

const checkNumberOfArguments = (
  context: Context,
  callee: Closure,
  args: Value[],
  exp: es.CallExpression
) => {
  if (callee.node.params.length !== args.length) {
    const error = new errors.InvalidNumberOfArguments(
      exp,
      callee.node.params.length,
      args.length
    )
    handleError(context, error)
  }
}

function* getArgs(context: Context, call: es.CallExpression) {
  const args = []
  for (const arg of call.arguments) {
    args.push(yield* evaluate(arg, context))
  }
  return args
}

export type Evaluator<T extends es.Node> = (
  node: T,
  context: Context
) => IterableIterator<Value>

export const evaluators: { [nodeType: string]: Evaluator<es.Node> } = {
  /** Simple Values */
  Literal: function*(node: es.Literal, context: Context) {
    return node.value
  },
  ArrayExpression: function*(node: es.ArrayExpression, context: Context) {
    return node.elements.slice()
  },
  FunctionExpression: function*(node: es.FunctionExpression, context: Context) {
    return new Closure(node, currentFrame(context))
  },
  Identifier: function*(node: es.Identifier, context: Context) {
    return getVariable(context, node.name)
  },
  CallExpression: function*(node: es.CallExpression, context: Context) {
    const callee = yield* evaluate(node.callee, context)
    const args = yield* getArgs(context, node)
    const result = yield* apply(context, callee, args, node)
    return result
  },
  UnaryExpression: function*(node: es.UnaryExpression, context: Context) {
    const value = yield* evaluate(node.argument, context)
    if (node.operator === '!') {
      return !value
    } else if (node.operator === '-') {
      return -value
    } else {
      return +value
    }
  },
  BinaryExpression: function*(node: es.BinaryExpression, context: Context) {
    const left = yield* evaluate(node.left, context)
    const right = yield* evaluate(node.right, context)

    rttc.checkBinaryExpression(context, node.operator, left, right)

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
    return result
  },
  ConditionalExpression: function*(
    node: es.ConditionalExpression,
    context: Context
  ) {
    return yield* this.IfStatement(node, context)
  },
  LogicalExpression: function*(node: es.LogicalExpression, context: Context) {
    const left = yield* evaluate(node.left, context)
    if ((node.operator === '&&' && left) || (node.operator === '||' && !left)) {
      return yield* evaluate(node.right, context)
    } else {
      return left
    }
  },
  VariableDeclaration: function*(
    node: es.VariableDeclaration,
    context: Context
  ) {
    const declaration = node.declarations[0]
    const id = declaration.id as es.Identifier
    const value = yield* evaluate(declaration.init!, context)
    defineVariable(context, id.name, value)
    return undefined
  },
  AssignmentExpression: function*(
    node: es.AssignmentExpression,
    context: Context
  ) {
    const id = node.left as es.Identifier
    // Make sure it exist
    const value = yield* evaluate(node.right, context)
    setVariable(context, id.name, value)
    return value
  },
  FunctionDeclaration: function*(
    node: es.FunctionDeclaration,
    context: Context
  ) {
    const id = node.id as es.Identifier
    // tslint:disable-next-line:no-any
    const closure = new Closure(node as any, currentFrame(context))
    defineVariable(context, id.name, closure)
    return undefined
  },
  IfStatement: function*(node: es.IfStatement, context: Context) {
    const test = yield* evaluate(node.test, context)
    if (test) {
      return yield* evaluate(node.consequent, context)
    } else if (node.alternate) {
      return yield* evaluate(node.alternate, context)
    } else {
      return undefined
    }
  },
  ExpressionStatement: function*(
    node: es.ExpressionStatement,
    context: Context
  ) {
    return yield* evaluate(node.expression, context)
  },
  ReturnStatement: function*(node: es.ReturnStatement, context: Context) {
    if (node.argument) {
      if (node.argument.type === 'CallExpression') {
        const callee = yield* evaluate(node.argument.callee, context)
        const args = yield* getArgs(context, node.argument)
        return new TailCallReturnValue(callee, args, node.argument)
      } else {
        return new ReturnValue(yield* evaluate(node.argument, context))
      }
    } else {
      return new ReturnValue(undefined)
    }
  },
  WhileStatement: function*(node: es.WhileStatement, context: Context) {
    let value: any // tslint:disable-line
    let test
    while (
      (test = yield* evaluate(node.test, context)) &&
      !(value instanceof ReturnValue) &&
      !(value instanceof TailCallReturnValue)
    ) {
      value = yield* evaluate(node.body, context)
    }
    return value
  },
  BlockStatement: function*(node: es.BlockStatement, context: Context) {
    let result: Value
    for (const statement of node.body) {
      result = yield* evaluate(statement, context)
      if (result instanceof ReturnValue) {
        break
      }
    }
    return result
  },
  Program: function*(node: es.BlockStatement, context: Context) {
    let result: Value
    for (const statement of node.body) {
      result = yield* evaluate(statement, context)
      if (result instanceof ReturnValue) {
        break
      }
    }
    return result
  }
}

export function* evaluate(node: es.Node, context: Context) {
  yield* visit(context, node)
  const result = yield* evaluators[node.type](node, context)
  yield* leave(context)
  return result
}

export function* apply(
  context: Context,
  callee: Closure | Value,
  args: Value[],
  node?: es.CallExpression
) {
  let result: Value
  let total = 0

  while (!(result instanceof ReturnValue)) {
    if (callee instanceof Closure) {
      checkCallStackSize(context, node!)
      checkNumberOfArguments(context, callee, args, node!)
      const frame = createFrame(callee, args, node)
      if (result instanceof TailCallReturnValue) {
        replaceFrame(context, frame)
      } else {
        pushFrame(context, frame)
        total++
      }
      result = yield* evaluate(callee.node.body, context)
      if (result instanceof TailCallReturnValue) {
        callee = result.callee
        node = result.node
        args = result.args
      } else if (!(result instanceof ReturnValue)) {
        // No Return Value, set it as undefined
        result = new ReturnValue(undefined)
      }
    } else if (typeof callee === 'function') {
      try {
        result = callee.apply(null, args.map(a => toJS(a, context)))
        break
      } catch (e) {
        // Recover from exception
        const globalFrame =
          context.runtime.frames[context.runtime.frames.length - 1]
        context.runtime.frames = [globalFrame]
        const loc = node ? node.loc! : constants.UNKNOWN_LOCATION
        handleError(context, new errors.ExceptionError(e, loc))
        result = undefined
      }
    } else {
      handleError(context, new errors.CallingNonFunctionValue(callee, node))
      result = undefined
      break
    }
  }
  // Unwraps return value and release stack frame
  if (result instanceof ReturnValue) {
    result = result.value
  }
  for (let i = 1; i <= total; i++) {
    popFrame(context)
  }
  return result
}
