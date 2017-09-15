import { InterpreterState as State, Value } from '../types/dynamic'
import Closure from '../Closure'
import { apply } from '../interpreter'

const sourceValueToJS = (state: State, value: Value) => {
  if (value instanceof Closure) {
    return function() {
      const args: Value[] = []
      Array.prototype.forEach.call(arguments, (m: {}) => {
        args.push(m)
      })
      const gen = apply(value, args, state)
      let it = gen.next()
      while (!it.done) {
        it = gen.next()
      }
      return (it.value as State).value
    }
  } else {
    return value
  }
}

export default sourceValueToJS
