import { DEMO_UID } from '~/utils/demo'

// The head script in nuxt.config.js reads this flag before the first paint.
function rememberDemo(isDemo) {
  try {
    if (isDemo) {
      localStorage.setItem('bim-demo', '1')
      document.documentElement.classList.add('is-demo')
    } else {
      localStorage.removeItem('bim-demo')
      document.documentElement.classList.remove('is-demo')
    }
  } catch (e) {
    // Private windows can refuse storage: the notice then makes room for itself when it appears.
  }
}

// Root store: mirrors the Firebase auth state. @nuxtjs/firebase dispatches onAuthStateChangedAction once before the
// app starts in the browser and again on every sign in or sign out.
export const state = () => ({
  authReady: false
})

export const mutations = {
  SET_AUTH_READY(state) {
    state.authReady = true
  }
}

export const actions = {
  onAuthStateChangedAction({ commit }, { authUser }) {
    if (authUser) {
      const { uid, email, displayName } = authUser
      rememberDemo(uid === DEMO_UID)
      commit('user/SET_USER', { uid, email, displayName: displayName || null })
      commit('user/SET_LOGGED_IN', true)
    } else {
      rememberDemo(false)
      commit('user/SET_USER', null)
      commit('user/SET_LOGGED_IN', false)
    }
    commit('SET_AUTH_READY')
  }
}
