import { Library } from './shape'

function addScript(src: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/lib/' + src
    script.onload = () => {
      resolve()
    }
    script.onerror = () => {
      reject()
    }
    document.head.appendChild(script)
  })
}

export async function loadLibrary(library: Library) {
  for (const file of library.files) {
    await addScript(file)
  }
  for (const [key, value] of library.globals) {
    window[key] = value
  }
}
