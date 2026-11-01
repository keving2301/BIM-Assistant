<template>
  <div class="auth-page app-canvas">
    <div class="auth-card panel">
      <h1>Sign in</h1>
      <p class="auth-lead">Open your projects and models.</p>

      <b-alert :show="!!error" variant="danger" class="mb-4" role="alert">{{ error }}</b-alert>

      <b-form novalidate @submit.prevent="signIn">
        <b-form-group label="Email" label-for="email" :state="state('email')" :invalid-feedback="errors.email">
          <b-form-input
            id="email"
            v-model.trim="email"
            type="email"
            autocomplete="username"
            :state="state('email')"
            @blur="touched.email = true"
          />
        </b-form-group>

        <b-form-group label="Password" label-for="password" :state="state('password')" :invalid-feedback="errors.password">
          <b-form-input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            :state="state('password')"
            @blur="touched.password = true"
          />
        </b-form-group>

        <b-button type="submit" variant="primary" block class="mt-4" :disabled="busy">
          <b-spinner v-if="busy" small class="mr-2" label="Signing in" />
          {{ busy ? 'Signing in' : 'Sign in' }}
        </b-button>
      </b-form>

      <p class="auth-switch">
        New here? <nuxt-link :to="{ path: '/sign_up', query: $route.query }">Create an account</nuxt-link>
      </p>
    </div>
  </div>
</template>

<script>
import { authErrorMessage } from '~/utils/auth-errors'
import { safeRedirect, waitForSignedIn } from '~/utils/auth'
import { DEMO_EMAIL, DEMO_PASSWORD } from '~/utils/demo'

export default {
  name: 'SignIn',
  data() {
    return {
      email: '',
      password: '',
      touched: { email: false, password: false },
      submitted: false,
      busy: false,
      error: ''
    }
  },
  head: {
    title: 'Sign in'
  },
  computed: {
    errors() {
      return {
        email: !this.email ? 'Enter your email address.' : !/^\S+@\S+\.\S+$/.test(this.email) ? 'Enter a valid email address.' : '',
        password: !this.password ? 'Enter your password.' : ''
      }
    }
  },
  mounted() {
    if (this.$store.state.user.user.loggedIn) {
      this.$router.replace(safeRedirect(this.$route.query.redirect))
      return
    }
    // The form opens with the public demo account filled in, so a visitor only presses Sign in. The values are set
    // after mount so a password manager that fills the form on load does not leave it half filled.
    this.email = DEMO_EMAIL
    this.password = DEMO_PASSWORD
  },
  methods: {
    state(field) {
      if (!this.touched[field] && !this.submitted) return null
      return this.errors[field] ? false : null
    },
    async signIn() {
      this.submitted = true
      this.error = ''
      if (this.errors.email || this.errors.password || this.busy) return
      this.busy = true
      try {
        await this.$fireAuth.signInWithEmailAndPassword(this.email, this.password)
        await waitForSignedIn(this.$store)
        this.$router.replace(safeRedirect(this.$route.query.redirect))
      } catch (err) {
        this.error = authErrorMessage(err)
        this.busy = false
      }
    }
  }
}
</script>
