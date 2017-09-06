import stringifyValue from '../utils/stringify'

export function display(value: any) {
  const output = stringifyValue(value)
  if (typeof window.__REDUX_STORE__ !== 'undefined') {
    window.__REDUX_STORE__.dispatch({
      type: 'CREATE_INTERPRETER_OUTPUT',
      payload: output
    })
  } else {
    console.log(output)
  }
}

export function timed(this: any, f: Function) {
  var self = this
	var timerType = window.performance ? performance : Date
	return function() {
    var start = timerType.now()
		var result = f.apply(self, arguments)
		var diff = (timerType.now() - start)
		display('Duration: ' + Math.round(diff) + 'ms')
		return result
	}
}
