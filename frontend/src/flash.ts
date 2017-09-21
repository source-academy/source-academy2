import { Toaster, IToaster, Position, Intent } from '@blueprintjs/core'

function showFlashToast(toaster: IToaster, el: Element, intent: Intent) {
  const message = el.childNodes[0].nodeValue!
  toaster.show({
    message,
    timeout: 4000,
    intent: Intent.PRIMARY
  })
}

function showFlashToasts() {
  const toaster = Toaster.create({ position: Position.TOP })
  const $info = document.querySelector('#sa-info-flash')
  const $error = document.querySelector('#sa-error-flash')
  if ($info !== null) {
    showFlashToast(toaster, $info, Intent.PRIMARY)
  } else if ($error !== null) {
    showFlashToast(toaster, $error, Intent.PRIMARY)
  }
}

// Procure Toaster on Flash
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(showFlashToasts, 500)
})
