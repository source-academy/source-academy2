import * as es from 'estree'
import { SourceError } from '../types/error'
import { Rule } from '../types/static'

export class NoNonEmptyListError implements SourceError {
  constructor(public node: es.ArrayExpression) {}

  get location() {
    return this.node.loc!
  }

  explain() {
    return 'Only empty list notation ([]) is allowed'
  }

  elaborate() {
    return 'TODO'
  }
}

const noNonEmptyList: Rule<es.ArrayExpression> = {
  name: 'no-non-empty-list',

  checkNodes: {
    ArrayExpression(node: es.ArrayExpression) {
      if (node.elements.length > 0) {
        return [new NoNonEmptyListError(node)]
      } else {
        return []
      }
    }
  }
}

export default noNonEmptyList
