import * as es from 'estree'
import { createNode } from './astUtils'
import { Scope, Value } from './types/dynamic'

/** Keep track how many lambdas are created */
let lambdaCtr = 0

/**
 * Models function value in the interpreter environment.
 */
class Closure {
  /** The Function Expression */
  public node: es.FunctionExpression

  /** Unique ID defined for anonymous closure */
  public name: string

  constructor(
    node: es.FunctionExpression,
    public enclosingScope: Scope
  ) {
    this.node = node
    this.enclosingScope = enclosingScope
    if (this.node.id) {
      this.name = this.node.id.name
    } else {
      this.name = `anonymous-${++lambdaCtr}`
    }
  }

  /**
   * Open a new scope from this function value by suppling list of arguments.
   * @param args List of arguments to be defined in the scope environment
   *
   * @returns {Scope}
   */
  createScope(args: Value[], callExpression?: es.CallExpression): Scope {
    const environment = {}
    this.node.params.forEach((p, idx) =>
      environment[(p as es.Identifier).name] = args[idx]
    )
    if (callExpression) {
      callExpression = {
        ...callExpression,
        arguments: callExpression.arguments.map(a => createNode(a) as any)
      }
    }
    return {
      name: this.getScopeName(args),
      parent: this.enclosingScope,
      callExpression,
      environment
    }
  }

  getScopeName(args: Value[]) {
    let name = `${this.name}(`
    args.forEach((arg, idx) => {
      if (arg instanceof Closure) {
        name += arg.name
      } else if (arg && arg.toString) {
        name += arg.toString()
      } else {
        name += 'undef'
      }
      if (idx < args.length - 1) {
        name += ', '
      }
    })
    name += ')'
    return name
  }
}

export default Closure
