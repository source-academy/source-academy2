import { Store } from 'redux'
import { Shape } from './shape'

declare global {
  interface Window {
    // Redux
    __REDUX_STORE__: Store<Shape>
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any

    // Rune
    RUNE_CONTEXT: string

    ToneMatrix: {
      initialise_matrix(canvas: HTMLElement): void
      randomise_matrix(): void
      clear_matrix(): void
    }

    ListVisualizer: {
      init(parent: any): void
      draw(xs: any[]): void
      next(): void
      previous(): void
      clear(): void
    }
  }
}
