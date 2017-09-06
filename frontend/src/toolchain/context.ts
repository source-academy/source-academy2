import { StaticState, CFG, anyT } from './types/static'

export type Options = {
  week: number
  externals: string[]
}

const defaultExternals = [
  'math_exp',
  'math_sqrt',
  'math_floor',
  'math_log',
  'alert'
]

const extraMath: string[] = []
let objs = Object.getOwnPropertyNames(Math)
for (let i in objs) {
  extraMath.push('math_' + objs[i])
}

const extraList = [
  'list',
  'pair',
  'is_pair',
  'is_list',
  'is_empty_list',
  'head',
  'tail',
  'length',
  'map',
  'build_list',
  'for_each',
  'list_to_string',
  'reverse',
  'append',
  'member',
  'remove',
  'remove_all',
  'equal',
  'assoc',
  'filter',
  'enum_list',
  'list_ref',
  'accumulate'
]

export const createContext = ({ week, externals }: Options): StaticState => {
  const initialEnvironment: { [name: string]: CFG.Sym } = {}
  externals = defaultExternals.concat(externals)
  if (week >= 4) {
    externals = [...externals, ...extraMath, 'display', 'timed']
  }
  if (week >= 5) {
    externals = [...externals, ...extraList, 'prompt', 'parseInt']
  }
  for (const external of externals) {
    initialEnvironment[external] = {
      name: external,
      type: anyT
    }
  }
  const undefinedType = { name: 'undefined' }
  const globalScope = {
    name: '*global*',
    env: initialEnvironment,
    type: undefinedType as CFG.Type,
    node: undefined,
    exits: []
  }
  return {
    week,
    parser: {
      errors: [],
      comments: []
    },
    cfg: {
      nodes: {},
      edges: {},
      scopes: [globalScope],
      errors: []
    }
  }
}
