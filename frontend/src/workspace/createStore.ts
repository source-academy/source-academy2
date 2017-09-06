import createSagaMiddleware from 'redux-saga'
import {
  applyMiddleware,
  Store,
  createStore as _createStore,
  compose
} from 'redux'

import rootReducer from './reducers'
import mainSaga from './sagas'
import { Shape } from './shape'
import { loadLibrary } from './libraryLoader'

const createStore = async (initialState = {}) => {
  let composeEnhancers = compose

  if (process.env.NODE_ENV === 'development') {
    if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    }
  }

  const sagaMiddleware = createSagaMiddleware()
  const middleware = [sagaMiddleware]

  const store: Store<Shape> = _createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  ) as any

  sagaMiddleware.run(mainSaga)

  await loadLibrary(store.getState().config.library)

  return store
}

export default createStore
