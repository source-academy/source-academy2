import { Environment, Value } from '../types/dynamic'

import * as list from '../stdlib/list'
import * as misc from '../stdlib/misc'

const define = (env: Environment, name: string, value: Value) => {
  env[name] = value
}

const createGlobalEnvironment = (week: number) => {
  const env: Environment = {}
  if (week >= 4) {
    define(env, 'display', misc.display)
    define(env, 'timed', misc.timed)
    // Define all Math libraries
    let objs = Object.getOwnPropertyNames(Math)
    for (let i in objs) {
      if (objs.hasOwnProperty(i)) {
        const val = objs[i]
        if (typeof Math[val] === 'function') {
          define(env, 'math_' + val, Math[val].bind())
        } else {
          define(env, 'math_' + val, Math[val])
        }
      }
    }
  }
  if (week >= 5) {
    define(env, 'list', list.list)
    define(env, 'pair', list.pair)
    define(env, 'is_pair', list.is_pair)
    define(env, 'is_list', list.is_list)
    define(env, 'is_empty_list', list.is_empty_list)
    define(env, 'head', list.head)
    define(env, 'tail', list.tail)
    define(env, 'length', list.length)
    define(env, 'map', list.map)
    define(env, 'build_list', list.build_list)
    define(env, 'for_each', list.for_each)
    define(env, 'list_to_string', list.list_to_string)
    define(env, 'reverse', list.reverse)
    define(env, 'append', list.append)
    define(env, 'member', list.member)
    define(env, 'remove', list.remove)
    define(env, 'remove_all', list.remove_all)
    define(env, 'equal', list.equal)
    define(env, 'assoc', list.assoc)
    define(env, 'filter', list.filter)
    define(env, 'enum_list', list.enum_list)
    define(env, 'list_ref', list.list_ref)
    define(env, 'accumulate', list.accumulate)

    define(env, 'prompt', prompt)
    define(env, 'parseInt', parseInt)
    if (window.ListVisualizer) {
      define(env, 'draw', window.ListVisualizer.draw)
    } else {
      define(env, 'draw', function() {
        throw new Error('List visualizer is not enabled')
      })
    }
  }
  define(env, 'alert', alert)
  define(env, 'math_floor', Math.floor)
  define(env, 'math_sqrt', Math.sqrt)
  define(env, 'math_log', Math.log)
  define(env, 'math_exp', Math.exp)

  return env
}

export default createGlobalEnvironment
