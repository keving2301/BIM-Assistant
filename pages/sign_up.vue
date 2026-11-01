<template>
  <div class="auth-page app-canvas">
    <div class="auth-card auth-card-wide panel">
      <h1>Create an account</h1>
      <p class="auth-lead">Your projects and models are visible only to you.</p>

      <b-alert :show="!!error" variant="danger" class="mb-4" role="alert">
        {{ error }}
        <nuxt-link v-if="emailTaken" :to="{ path: '/sign_in', query: $route.query }" class="alert-link">Sign in</nuxt-link>
      </b-alert>

      <b-form novalidate @submit.prevent="signUp">
        <b-form-group label="Full name" label-for="name" :state="state('name')" :invalid-feedback="errors.name">
          <b-form-input id="name" v-model.trim="form.name" autocomplete="name" :state="state('name')" @blur="touch('name')" />
        </b-form-group>

        <b-form-group label="Email" label-for="email" :state="state('email')" :invalid-feedback="errors.email">
          <b-form-input
            id="email"
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            :state="state('email')"
            @blur="touch('email')"
          />
        </b-form-group>

        <div class="form-row">
          <b-form-group
            class="col-sm-6"
            label="Password"
            label-for="password"
            :description="state('password') === false ? '' : 'At least 8 characters.'"
            :state="state('password')"
            :invalid-feedback="errors.password"
          >
            <b-form-input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              :state="state('password')"
              @blur="touch('password')"
            />
          </b-form-group>
          <b-form-group
            class="col-sm-6"
            label="Confirm password"
            label-for="password-confirm"
            :state="state('confirm')"
            :invalid-feedback="errors.confirm"
          >
            <b-form-input
              id="password-confirm"
              v-model="form.confirm"
              type="password"
              autocomplete="new-password"
              :state="state('confirm')"
              @blur="touch('confirm')"
            />
          </b-form-group>
        </div>

        <b-form-group label="Company" label-for="company" :state="state('company')" :invalid-feedback="errors.company">
          <b-form-input
            id="company"
            v-model.trim="form.company"
            autocomplete="organization"
            :state="state('company')"
            @blur="touch('company')"
          />
        </b-form-group>

        <div class="form-row">
          <b-form-group class="col-sm-6" label="Role" label-for="role" :state="state('role')" :invalid-feedback="errors.role">
            <b-form-select id="role" v-model="form.role" :options="roleOptions" :state="state('role')" @blur="touch('role')" />
          </b-form-group>
          <b-form-group class="col-sm-6" label-for="phone" :state="state('phone')" :invalid-feedback="errors.phone">
            <template #label>Phone <span class="optional">(optional)</span></template>
            <b-form-input
              id="phone"
              v-model.trim="form.phone"
              type="tel"
              autocomplete="tel"
              :state="state('phone')"
              @blur="touch('phone')"
            />
          </b-form-group>
        </div>

        <b-button type="submit" variant="primary" block class="mt-3" :disabled="busy">
          <b-spinner v-if="busy" small class="mr-2" label="Creating account" />
          {{ busy ? 'Creating account' : 'Create account' }}
        </b-button>
      </b-form>

      <p class="auth-switch">
        Already have an account? <nuxt-link :to="{ path: '/sign_in', query: $route.query }">Sign in</nuxt-link>
      </p>
    </div>
  </div>
</template>

<script>
import { authErrorMessage } from '~/utils/auth-errors'
import { safeRedirect, waitForSignedIn } from '~/utils/auth'
import { ROLES } from '~/utils/roles'

export default {
  name: 'SignUp',
  data() {
    return {
      form: { name: '', email: '', password: '', confirm: '', company: '', role: null, phone: '' },
      touched: {},
      submitted: false,
      busy: false,
      error: '',
      emailTaken: false
    }
  },
  head: {
    title: 'Create an account'
  },
  computed: {
    roleOptions() {
      return [{ value: null, text: 'Choose a role', disabled: true }, ...ROLES]
    },
    errors() {
      const f = this.form
      return {
        name: f.name ? '' : 'Enter your name.',
        email: !f.email ? 'Enter your email address.' : /^\S+@\S+\.\S+$/.test(f.email) ? '' : 'Enter a valid email address.',
        password: f.password.length >= 8 ? '' : 'Use at least 8 characters.',
        confirm: !f.confirm ? 'Enter the password again.' : f.confirm === f.password ? '' : 'The passwords do not match.',
        company: f.company ? '' : 'Enter your company name.',
        role: f.role ? '' : 'Choose a role.',
        phone: !f.phone || /^[+()\d\s.-]{7,20}$/.test(f.phone) ? '' : 'Enter a valid phone number.'
      }
    },
    valid() {
      return Object.values(this.errors).every((message) => !message)
    }
  },
  methods: {
    touch(field) {
      this.$set(this.touched, field, true)
    },
    state(field) {
      if (!this.touched[field] && !this.submitted) return null
      return this.errors[field] ? false : null
    },
    async signUp() {
      this.submitted = true
      this.error = ''
      this.emailTaken = false
      if (!this.valid) return
      this.busy = true
      const f = this.form
      try {
        const { user } = await this.$fireAuth.createUserWithEmailAndPassword(f.email, f.password)
        await user.updateProfile({ displayName: f.name })
        this.$store.commit('user/SET_DISPLAY_NAME', f.name)
        await this.$fireStore.collection('userdata').doc(user.uid).set({
          username: f.name,
          userEmail: f.email,
          companyName: f.company,
          userRole: f.role,
          userPhoneNumber: f.phone || null,
          createdAt: this.$fireStoreObj.FieldValue.serverTimestamp()
        })
        await waitForSignedIn(this.$store)
        this.$router.replace(safeRedirect(this.$route.query.redirect))
      } catch (err) {
        this.error = authErrorMessage(err)
        this.emailTaken = err.code === 'auth/email-already-in-use'
        this.busy = false
      }
    }
  }
}
</script>

<style>
.auth-card-wide {
  max-width: 560px;
}

.optional {
  color: var(--c-muted);
  font-weight: 400;
}
</style>
