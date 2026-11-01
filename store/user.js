export const state = () => ({
  user: {
    loggedIn: false,
    data: null
  }
})

export const getters = {
  user(state) {
    return state.user
  }
}

export const mutations = {
  SET_LOGGED_IN(state, value) {
    state.user.loggedIn = value
  },
  SET_USER(state, data) {
    state.user.data = data
  },
  SET_DISPLAY_NAME(state, displayName) {
    if (state.user.data) state.user.data = { ...state.user.data, displayName }
  }
}
