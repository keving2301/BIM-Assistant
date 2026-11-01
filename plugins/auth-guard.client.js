// The first page a visitor opens is prerendered, so the auth middleware did not run for it in the browser. By the
// time this plugin runs, @nuxtjs/firebase has already reported the first auth state, so the store is up to date.
// The redirect waits until the app has mounted (onNuxtReady) so it does not race the hydration of the first page.
import { isProtected, signInLocation } from '~/utils/auth'

export default ({ app, store }) => {
  window.onNuxtReady(() => {
    const route = app.router.currentRoute
    if (isProtected(route) && !store.state.user.user.loggedIn) {
      app.router.replace(signInLocation(route)).catch(() => {})
    }
  })
}
