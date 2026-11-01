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
      commit('user/SET_USER', { uid, email, displayName: displayName || null })
      commit('user/SET_LOGGED_IN', true)
    } else {
      commit('user/SET_USER', null)
      commit('user/SET_LOGGED_IN', false)
    }
    commit('SET_AUTH_READY')
  }
}
