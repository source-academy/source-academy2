import { InterpreterState } from '../toolchain/types/dynamic'

declare global {
  interface Window {
    // Redux
    __REDUX_STORE__: any
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any

    // Rune
    RUNE_CONTEXT: string

    CURRENT_INTERPRETER: InterpreterState

    ListVisualizer: {
      init(parent: any): void
      draw(xs: any[]): void
      next(): void
      previous(): void
      clear(): void
    }
  }
}
