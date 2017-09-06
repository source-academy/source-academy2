import * as es from 'estree'
import { Map } from 'immutable'
import { createNode } from './astUtils'
import { Scope } from './types/dynamic'

/**
 * Models function value in the interpreter environment.
 */
class Closure {
  /** The Function Expression */
  public node: es.FunctionExpression

  /** The enclosingScope scope */
  public enclosingScope: number

  /** Unique ID defined for anonymous closure */
  public id?: number

  constructor(
    node: es.FunctionExpression,
    enclosingScope: number,
    id?: number
  ) {
    this.node = node
    this.enclosingScope = enclosingScope
    this.id = id
  }

  /**
   * Open a new scope from this function value by suppling list of arguments.
   * @param args List of arguments to be defined in the scope environment
   *
   * @returns {Scope}
   */
  createScope(args: any[], callExpression?: es.CallExpression): Scope {
    const environment = this.node.params.reduce(
      (s, p, idx) => s.set((p as es.Identifier).name, args[idx]),
      Map<string, any>()
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

  /** Get name of the scope */
  get name() {
    return this.node.id ? this.node.id.name : `lambda_${this.id!}`
  }

  getScopeName(args: any[]) {
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
