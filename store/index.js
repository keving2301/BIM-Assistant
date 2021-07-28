export const actions = {
    async nuxtServerInit({dispatch, commit}, {res}) {
        if (res && res.locals && res.locals.user) {
            const {allClaims: claims, idToken: token, ...authUser} = res.locals.user
            await dispatch('onAuthStateChangedAction', {
                authUser,
                claims,
                token
            })
        }
    },
    async onAuthStateChangedAction({commit, dispatch}, {authUser}) {
        if (!authUser) {
            await dispatch('cleanupAction')
            return
        }
        const {uid, email, emailVerified, displayName, photoURL} = authUser

        commit('user/SET_USER', {
            uid,
            email,
            emailVerified,
            displayName,
            photoURL: photoURL || null
        })
        commit('user/SET_LOGGED_IN', true)
    },
    async cleanupAction({commit}) {
        commit('user/SET_USER', null)
        commit('user/SET_LOGGED_IN', false)
    }
}

export const mutations = {
    ON_AUTH_STATE_CHANGED_MUTATION(state, {authUser}) {
        if (authUser) {
            const {uid, email, emailVerified, displayName, photoURL} = authUser
            state.authUser = {
                uid,
                email,
                emailVerified,
                displayName,
                photoURL: photoURL || null
            }
        }
    }
}

export default {
    actions,
    mutations
}