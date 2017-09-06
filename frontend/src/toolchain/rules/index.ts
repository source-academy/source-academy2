import { Rule } from '../types/static'

import bracesAroundIfElse from './bracesAroundIfElse'
import noIfWithoutElse from './noIfWithoutElse'
import singleVariableDeclaration from './singleVariableDeclaration'
import strictEquality from './strictEquality'
import noImplicitDeclareUndefined from './noImplicitDeclareUndefined'
import noImplicitReturnUndefined from './noImplicitReturnUndefined'
import noNonEmptyList from './noNonEmptyList'

const rules: Array<Rule<any>> = [
  bracesAroundIfElse,
  singleVariableDeclaration,
  strictEquality,
  noIfWithoutElse,
  noImplicitDeclareUndefined,
  noImplicitReturnUndefined,
  noNonEmptyList
]

export default rules
