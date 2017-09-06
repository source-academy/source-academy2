/**
 * Interactive toolchain Session.
 */

import * as EventEmitter from 'eventemitter2'
import * as invariant from 'invariant'
import { List } from 'immutable'

import { parse } from './parser'
import { StaticState } from './types/static'
import { createContext } from './context'
import { InterpreterState } from './types/dynamic'
import { evalProgram, createInterpreter } from './interpreter'
import {
  VisualizerState,
  create as createVisualizer,
  next as nextVisualizer
} from './visualizer'
import { typecheck } from './typechecker'
import { generateCFG } from './cfg'

/**
 * The instance of this class models an interactive toolchain session.
 *
 * @example
 * const
 */
export class Session extends EventEmitter.EventEmitter2 {
  /** Current state of the interpreter */
  get interpreter() {
    return this._interpreter
  }
  set interpreter(to: InterpreterState | null) {
    ;(window as any).CURRENT_INTERPRETER = to
    this._interpreter = to
  }

  /** Current state of the expression visualizer */
  public visualizer: VisualizerState

  /** Current static analyzer state */
  public context: StaticState

  private genInterpreter: Iterator<InterpreterState>

  // tslint:disable-next-line
  private _interpreter: InterpreterState | null = null

  constructor(public week: number, public externals: string[]) {
    super()
  }

  /**
   * Re-start the parser, interpreter, and visualizer with
   * a new code. Emits start event when done.
   *
   * @param code The JavaScript code
   */
  start(code: string) {
    this.clear()

    this.evalCode(code)

    if (this.interpreter) {
      this.emit('start')
    }
  }

  clear() {
    this.interpreter = null
    delete this.context
    delete this.visualizer
  }

  /**
   * Evaluate single step of the program.
   */
  next() {
    invariant(this.genInterpreter, 'start() must be called before calling next')

    if (this.interpreter && this.interpreter.isRunning) {
      const { value: nextInterpreter } = this.genInterpreter.next()

      // Stop interpreter on error
      if (!nextInterpreter.errors.isEmpty()) {
        this.emit('errors', nextInterpreter.errors.toJS())
      }

      // Update states
      this.interpreter = nextInterpreter
      this.visualizer = nextVisualizer(this.visualizer, this.interpreter)

      // Emit appropriate events
      if (!this.interpreter.isRunning) {
        this.emit('done')
      } else {
        this.emit('next')
      }
    }
  }

  /**
   * Evaluate the remaining program until end.
   */
  untilEnd() {
    while (this.interpreter && this.interpreter.isRunning) {
      this.next()
    }
  }

  /**
   * Evaluate another code.
   *
   * @param code The code to be evaluated.
   */
  addCode(code: string) {
    invariant(this.interpreter, 'Must call start() before addCode()')
    invariant(
      this.interpreter && !this.interpreter.isRunning,
      'Cannot add more code when previous evaluation is in progress'
    )

    this.evalCode(code)
    this.emit('start')
  }

  private evalCode(code: string) {
    delete this.genInterpreter
    this.context =
      this.context ||
      createContext({
        week: this.week,
        externals: this.externals
      })
    this.context.parser.errors = []
    this.context.cfg.errors = []
    this.context = parse(code, this.context)
    const parserErrors = this.context.parser.errors
    if (parserErrors.length > 0) {
      this.emit('errors', parserErrors)
    } else {
      generateCFG(this.context)
      typecheck(this.context)
      const typeErrors = this.context.cfg.errors
      if (typeErrors.length > 0) {
        this.emit('errors', typeErrors)
      } else {
        this.visualizer = createVisualizer()
        this.interpreter = (this.interpreter ||
          createInterpreter(this.externals, this.week))
          .merge({
            isRunning: true
          }) as InterpreterState
        this.interpreter = this.interpreter.with({
          errors: List<any>()
        })
        this.genInterpreter = evalProgram(
          this.context.parser.program!,
          this.interpreter
        )
      }
    }
  }
}

/**
 * Create a new session from some configuration.
 *
 * @param week The week of the language to be used.
 * @returns {Session}
 */
export const createSession = (
  week: number,
  externals: string[] = []
): Session => {
  return new Session(week, externals)
}
