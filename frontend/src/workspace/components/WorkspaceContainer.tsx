import * as React from 'react'
import { Store } from 'redux'
import { Provider } from 'react-redux'
import { Shape } from '../shape'

type Props = {
  store: Store<Shape>
}

const WorkspaceContainer: React.StatelessComponent<Props> = ({ store, children }) =>
  <Provider store={store}>
    {children}
  </Provider>

export default WorkspaceContainer
