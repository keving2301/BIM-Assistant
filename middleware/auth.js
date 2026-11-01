// Runs on client-side navigation. The first page load of a static site is covered by plugins/auth-guard.client.js,
// because Nuxt runs route middleware for it at build time only.
import { isProtected, signInLocation } from '~/utils/auth'

export default function ({ store, route, redirect }) {
  if (process.server) return
  if (isProtected(route) && !store.state.user.user.loggedIn) {
    redirect(signInLocation(route))
  }
}
