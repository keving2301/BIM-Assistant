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
    }
}

export const actions = {
    fetchUser({commit}, user) {
        commit("SET_LOGGED_IN", user !== null)
        if (user) {
            commit("SET_USER", {
                displayName: user.displayName,
                uid: user.uid,
                email: user.email
            })
        } else {
            commit("SET_USER", null)
        }
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}