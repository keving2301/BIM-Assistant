// Adds a script or stylesheet to the page once and resolves when it has loaded.
const pending = {}

export function loadScript(src) {
  if (!pending[src]) {
    pending[src] = new Promise((resolve, reject) => {
      const el = document.createElement('script')
      el.src = src
      el.async = true
      el.onload = () => resolve()
      el.onerror = () => {
        delete pending[src]
        reject(new Error(`Could not load ${src}`))
      }
      document.head.appendChild(el)
    })
  }
  return pending[src]
}

export function loadStyle(href) {
  if (!pending[href]) {
    pending[href] = new Promise((resolve, reject) => {
      const el = document.createElement('link')
      el.rel = 'stylesheet'
      el.href = href
      el.onload = () => resolve()
      el.onerror = () => reject(new Error(`Could not load ${href}`))
      document.head.appendChild(el)
    })
  }
  return pending[href]
}
