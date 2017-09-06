/// <reference path="index.d.ts" />
import 'phoenix_html'
import { Toaster, Position, Intent } from '@blueprintjs/core'
import './styles/index.scss'
import * as components from './components'
;(function(exports: any) {
  exports.sa = {
    components
  }
})(window)

// Procure Toaster on Flash
setTimeout(() => {
  const flashToast = Toaster.create({
    position: Position.TOP
  })
  const $info = document.querySelector('#sa-info-flash')
  const $error = document.querySelector('#sa-error-flash')
  if ($info !== null) {
    const message = $info.childNodes[0].nodeValue!
    flashToast.show({
      message,
      timeout: 4000,
      intent: Intent.PRIMARY
    })
  } else if ($error !== null) {
    const message = $error.childNodes[0].nodeValue!
    flashToast.show({
      message,
      timeout: 4000,
      intent: Intent.DANGER
    })
  }
}, 500)

// Render Markdown
document.addEventListener('DOMContentLoaded', function(event) {
  const items = document.querySelectorAll('div.markdown-view')
  for (let i = 0; i < items.length; i++) {
    components.markdownView(items.item(i) as any)
  }
})
