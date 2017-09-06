interface Window extends Window {
  // Redux
  __REDUX_STORE__: any
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any

  // CS1101S Specific
  RUNE_CONTEXT: string
}

declare var window: Window
