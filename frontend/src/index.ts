/// <reference path="index.d.ts" />
import 'phoenix_html'

import './styles/index.scss'
import './components'
import './flash'
import './markdown'

document.addEventListener('DOMContentLoaded', async () => {
  const workspace = document.querySelector('.sa-workspace')
  const game = document.querySelector('.sa-game')
  if (workspace) {
    await import(/* webpackChunkName: "workspace" */ './workspace')
  } else if (game) {
    await import(/* webpackChunkName: "story-xml" */ './story-xml')
  }
})
