import * as es from 'estree'
import { TypeError } from '../types/static'
import { Value } from '../types/dynamic'

export class NonNumberInBinaryArithmeticExpression
extends TypeError<es.BinaryExpression
  > {
  constructor(
    node: es.BinaryExpression,
    got: CFG.Type,
    public leftOrRight: 'left' | 'right',
    proof?: es.Node
  ) {
    super(node, [numberT], got, proof)
  }

  explain() {
    return `Non-number in
      ${this.leftOrRight} hand side of arithmetic operation.`
  }

  elaborate() {
    return 'TODO'
  }
}

const isNumber = (v: Value) => typeof v === 'number'
const isString = (v: Value) => typeof v === 'string'
const isBoolean = (v: Value) => typeof v === 'boolean'
const isStringOrNumber = (v: Value) => isNumber(v) || isString(v)

const checkAddition = (left: Value, right: Value) => {
}
  (isNumber(left) || isString(left))
  && (isNumber(right) || isString(right))

const checkBinaryArithmetic = (left: Value, right: Value) =>
  (isNumber(left) && isNumber(right))

export const checkBinaryExpression
  = (operator: es.BinaryOperator, left: Value, right: Value) => {
    switch (operator) {
      case '+':
        return checkAddition(left, right)
      case '-':
      case '*':
      case '/':
      case '%':
        return checkBinaryArithmetic(left, right)
      case '<':
      case '<=':
      case '>':
      case '>=':
        return checkComparison(left, right)
      case '!==':
      default:
      return checkBinaryArithmetic(left, right)
    }
  }
