import * as es from 'estree'

import { Rule } from '../types'

import bracesAroundIfElse from './bracesAroundIfElse'
import noIfWithoutElse from './noIfWithoutElse'
import singleVariableDeclaration from './singleVariableDeclaration'
import strictEquality from './strictEquality'
import noImplicitDeclareUndefined from './noImplicitDeclareUndefined'
import noImplicitReturnUndefined from './noImplicitReturnUndefined'
import noNonEmptyList from './noNonEmptyList'

const rules: Array<Rule<es.Node>> = [
  bracesAroundIfElse,
  singleVariableDeclaration,
  strictEquality,
  noIfWithoutElse,
  noImplicitDeclareUndefined,
  noImplicitReturnUndefined,
  noNonEmptyList
]

export default rules
