<template>
  <div class="auth-page app-canvas">
    <div class="auth-stack">
      <header class="auth-header">
        <h1>Sign in</h1>
        <p class="auth-lead">Open your projects and models.</p>
      </header>

      <b-alert :show="!!error" variant="danger" class="mb-4" role="alert">{{ error }}</b-alert>

      <section id="demo" class="demo-access" aria-labelledby="demo-heading">
        <h2 id="demo-heading">Demo access</h2>
        <p>
          The data in this demo is fictional. The demo account has an apartment block model that is ready to view,
          with its summary and the chat. Uploading and deleting are turned off in it.
        </p>
        <dl class="demo-credentials">
          <div>
            <dt>Email</dt>
            <dd><code>{{ demoEmail }}</code></dd>
          </div>
          <div>
            <dt>Password</dt>
            <dd><code>{{ demoPassword }}</code></dd>
          </div>
        </dl>
        <b-button variant="primary" block class="demo-button" :disabled="!!busy" @click="signInDemo">
          <b-spinner v-if="busy === 'demo'" small class="mr-2" label="Signing in" />
          {{ busy === 'demo' ? 'Signing in' : 'Sign in as the demo account' }}
        </b-button>
      </section>

      <section class="auth-card own-account panel" aria-labelledby="own-heading">
        <h2 id="own-heading">Use your own account</h2>
        <b-form novalidate @submit.prevent="signIn">
          <b-form-group label="Email" label-for="email" :state="state('email')" :invalid-feedback="errors.email">
            <b-form-input
              id="email"
              v-model.trim="email"
              type="email"
              autocomplete="email"
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

          <b-button type="submit" variant="primary" block class="mt-4" :disabled="!!busy">
            <b-spinner v-if="busy === 'form'" small class="mr-2" label="Signing in" />
            {{ busy === 'form' ? 'Signing in' : 'Sign in' }}
          </b-button>
        </b-form>

        <p class="auth-switch">
          New here? <nuxt-link :to="{ path: '/sign_up', query: $route.query }">Create an account</nuxt-link>
        </p>
      </section>
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
      // '' when idle, otherwise which button is signing in
      busy: '',
      error: '',
      demoEmail: DEMO_EMAIL,
      demoPassword: DEMO_PASSWORD
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
      await this.signInWith(this.email, this.password, 'form')
    },
    async signInDemo() {
      this.error = ''
      await this.signInWith(DEMO_EMAIL, DEMO_PASSWORD, 'demo')
    },
    async signInWith(email, password, source) {
      this.busy = source
      try {
        await this.$fireAuth.signInWithEmailAndPassword(email, password)
        await waitForSignedIn(this.$store)
        this.$router.replace(safeRedirect(this.$route.query.redirect))
      } catch (err) {
        this.error = authErrorMessage(err)
        this.busy = ''
      }
    }
  }
}
</script>

<style>
.auth-stack {
  width: 100%;
  max-width: 440px;
}

.auth-header h1 {
  font-size: 1.75rem;
  margin-bottom: 4px;
}

.demo-access {
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid #c9cfec;
  border-radius: var(--radius-lg);
  background: var(--c-accent-weak);
}

.demo-access h2 {
  font-size: 1.125rem;
  margin-bottom: 8px;
}

.demo-access p {
  margin-bottom: 16px;
  color: var(--c-ink-2);
  font-size: 0.9375rem;
}

.demo-credentials {
  margin: 0 0 16px;
  padding: 12px 16px;
  border: 1px solid #c9cfec;
  border-radius: var(--radius);
  background: var(--c-surface);
}

.demo-credentials > div {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 16px;
  padding: 4px 0;
}

.demo-credentials dt {
  flex: 0 0 72px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--c-ink-2);
}

.demo-credentials dd {
  margin: 0;
  min-width: 0;
}

.demo-credentials code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9375rem;
  color: var(--c-ink);
  overflow-wrap: anywhere;
  user-select: all;
}

.own-account h2 {
  font-size: 1.125rem;
  margin-bottom: 20px;
}

@media (min-width: 576px) {
  .demo-access {
    padding: 24px;
  }
}
</style>
