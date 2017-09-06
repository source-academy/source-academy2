import { generate } from 'astring'

import Closure from '../Closure'
import {stringifyList} from '../stdlib/list'

function stripBody(body: string) {
  const lines = body.split(/\n/)
  if (lines.length >= 2) {
    return lines[0] + '\n\t[implementation hidden]\n' + lines[lines.length - 1]
  } else {
    return body
  }
}

function stringify(value: any) {
  if (value instanceof Closure) {
    return generate(value.node)
  } else if (Array.isArray(value)) {
    return stringifyList(value)
  } else if (typeof value === 'string') {
    return `\"${value}\"`
  } else if (typeof value === 'undefined') {
    return 'undefined'
  } else if (typeof value === 'function') {
    if (value.__SOURCE__) {
      return stripBody(value.__SOURCE__)
    } else {
      return stripBody(value.toString())
    }
  } else {
    return value.toString()
  }
}

;(window as any).stringifyValue = stringify

export default stringify
