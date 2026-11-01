// Pages that only make sense when signed in. A signed-out visit goes to the sign-in page and comes back afterwards.
export const PROTECTED_PATHS = ['/projects', '/profile', '/viewer']

export function isProtected(route) {
  return PROTECTED_PATHS.some((path) => route.path === path || route.path.startsWith(`${path}/`))
}

export function signInLocation(route) {
  return { path: '/sign_in', query: { redirect: route.fullPath } }
}

// Where to go after signing in: the page the visitor asked for, if it is one of ours.
export function safeRedirect(value, fallback = '/projects') {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : fallback
}

// Resolves once the store has the signed-in user. Firebase resolves signInWithEmailAndPassword before
// onAuthStateChanged reaches the store, and the auth middleware reads the store.
export function waitForSignedIn(store, timeout = 10000) {
  if (store.state.user.user.loggedIn) return Promise.resolve()
  return new Promise((resolve) => {
    const timer = setTimeout(done, timeout)
    const unwatch = store.watch((state) => state.user.user.loggedIn, (loggedIn) => loggedIn && done())
    function done() {
      clearTimeout(timer)
      unwatch()
      resolve()
    }
  })
}
