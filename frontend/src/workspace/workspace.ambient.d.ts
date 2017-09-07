interface Window extends Window {
  // Redux
  __REDUX_STORE__: any
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any

  // Rune
  RUNE_CONTEXT: string

  ListVisualizer: {
    init(parent: any): void
    draw(xs: any[]): void
    next(): void
    previous(): void
    clear(): void
  }
}

declare var window: Window
