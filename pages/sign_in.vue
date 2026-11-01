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
            autocomplete="email"
            :state="state('email')"
            autofocus
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
    }
  },
  methods: {
    state(field) {
      if (!this.touched[field] && !this.submitted) return null
      return this.errors[field] ? false : null
    },
    async signIn() {
      this.submitted = true
      this.error = ''
      if (this.errors.email || this.errors.password) return
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

<style>
.auth-page {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 16px 64px;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  padding: 32px 24px;
}

.auth-card h1 {
  font-size: 1.75rem;
  margin-bottom: 4px;
}

.auth-lead {
  color: var(--c-ink-2);
  margin-bottom: 24px;
}

.auth-card .form-group {
  margin-bottom: 20px;
}

.auth-switch {
  margin: 24px 0 0;
  padding-top: 20px;
  border-top: 1px solid var(--c-line);
  color: var(--c-ink-2);
  font-size: 0.9375rem;
}

@media (min-width: 576px) {
  .auth-page {
    padding-top: 80px;
  }

  .auth-card {
    padding: 40px;
  }
}
</style>
