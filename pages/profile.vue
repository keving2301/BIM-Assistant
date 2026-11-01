<template>
  <div class="app-canvas">
    <div class="page-container">
      <header class="page-header">
        <div>
          <h1>Profile</h1>
          <p>Your details and a list of your projects.</p>
        </div>
      </header>

      <b-alert :show="!!loadError" variant="danger" role="alert">{{ loadError }}</b-alert>

      <div class="demo-slot"><DemoNote /></div>

      <div class="profile-grid">
        <section class="panel profile-panel details-panel" :class="{ 'is-loading': !loaded }" aria-labelledby="details-heading">
          <h2 id="details-heading" class="panel-title">Your details</h2>
          <p v-if="!loaded" class="muted-line"><b-spinner small class="mr-2" />Loading your profile</p>
          <b-form v-else novalidate @submit.prevent="save">
            <b-form-group label="Full name" label-for="name" :state="state('name')" :invalid-feedback="errors.name">
              <b-form-input id="name" v-model.trim="form.name" autocomplete="name" :state="state('name')" :disabled="isDemo" />
            </b-form-group>
            <b-form-group label="Email" label-for="email" description="The email you sign in with.">
              <b-form-input id="email" :value="email" type="email" readonly plaintext class="plaintext-field" />
            </b-form-group>
            <b-form-group label="Company" label-for="company" :state="state('company')" :invalid-feedback="errors.company">
              <b-form-input id="company" v-model.trim="form.company" autocomplete="organization" :state="state('company')" :disabled="isDemo" />
            </b-form-group>
            <div class="form-row">
              <b-form-group class="col-sm-6" label="Role" label-for="role">
                <b-form-select id="role" v-model="form.role" :options="roles" :disabled="isDemo" />
              </b-form-group>
              <b-form-group class="col-sm-6" label-for="phone" :state="state('phone')" :invalid-feedback="errors.phone">
                <template #label>Phone <span class="optional">(optional)</span></template>
                <b-form-input id="phone" v-model.trim="form.phone" type="tel" autocomplete="tel" :state="state('phone')" :disabled="isDemo" />
              </b-form-group>
            </div>
            <div class="form-actions">
              <b-button type="submit" variant="primary" :disabled="saving || !dirty || isDemo">
                <b-spinner v-if="saving" small class="mr-2" label="Saving" />{{ saving ? 'Saving' : 'Save changes' }}
              </b-button>
              <span v-if="savedAt && !dirty" class="saved-note" role="status">
                <b-icon-check-circle-fill aria-hidden="true" class="mr-1" />Changes saved
              </span>
            </div>
          </b-form>
        </section>

        <section class="panel profile-panel projects-panel" :class="{ 'is-loading': projects === null }" aria-labelledby="projects-heading">
          <div class="panel-title-row">
            <h2 id="projects-heading" class="panel-title">Projects</h2>
            <nuxt-link to="/projects" class="small-link">Manage projects</nuxt-link>
          </div>
          <p v-if="projects === null" class="muted-line"><b-spinner small class="mr-2" />Loading projects</p>
          <p v-else-if="!projects.length" class="muted-line">No projects yet. <nuxt-link to="/projects" class="ml-1">Create one</nuxt-link></p>
          <ul v-else class="project-list">
            <li v-for="project in projects" :key="project.id">
              <nuxt-link :to="{ path: '/viewer', query: { project: project.id } }">{{ project.name }}</nuxt-link>
              <span class="project-date">Created {{ formatDate(project.createdAt) }}</span>
            </li>
          </ul>
          <p v-if="memberSince" class="member-since">Member since {{ memberSince }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '~/utils/format'
import { ROLES } from '~/utils/roles'

export default {
  name: 'Profile',
  data() {
    return {
      form: { name: '', company: '', role: null, phone: '' },
      original: null,
      loaded: false,
      loadError: '',
      saving: false,
      savedAt: null,
      submitted: false,
      projects: null,
      memberSince: ''
    }
  },
  head: {
    title: 'Profile'
  },
  computed: {
    uid() {
      const data = this.$store.state.user.user.data
      return data && data.uid
    },
    isDemo() {
      return this.$store.getters['user/isDemo']
    },
    email() {
      const data = this.$store.state.user.user.data
      return (data && data.email) || ''
    },
    roles() {
      return [{ value: null, text: 'Choose a role', disabled: true }, ...ROLES]
    },
    errors() {
      return {
        name: this.form.name ? '' : 'Enter your name.',
        company: this.form.company ? '' : 'Enter your company name.',
        phone: !this.form.phone || /^[+()\d\s.-]{7,20}$/.test(this.form.phone) ? '' : 'Enter a valid phone number.'
      }
    },
    dirty() {
      return this.original && JSON.stringify(this.form) !== JSON.stringify(this.original)
    }
  },
  mounted() {
    if (this.uid) this.load()
  },
  methods: {
    formatDate,
    state(field) {
      return this.submitted && this.errors[field] ? false : null
    },
    async load() {
      const userRef = this.$fireStore.collection('userdata').doc(this.uid)
      try {
        const [doc, projects] = await Promise.all([userRef.get(), userRef.collection('buckets').orderBy('createdAt', 'desc').get()])
        const data = doc.exists ? doc.data() : {}
        const authUser = this.$fireAuth.currentUser
        this.form = {
          name: data.username || (authUser && authUser.displayName) || '',
          company: data.companyName || '',
          role: data.userRole && ROLES.includes(data.userRole) ? data.userRole : null,
          phone: data.userPhoneNumber || ''
        }
        this.original = { ...this.form }
        this.memberSince = authUser && authUser.metadata.creationTime ? formatDate(authUser.metadata.creationTime) : ''
        this.projects = projects.docs.map((d) => ({ id: d.id, ...d.data() }))
      } catch (err) {
        console.error(err)
        this.loadError = 'Your profile could not be loaded.'
        this.projects = this.projects || []
      } finally {
        this.loaded = true
      }
    },
    async save() {
      this.submitted = true
      if (Object.values(this.errors).some(Boolean)) return
      this.saving = true
      try {
        await this.$fireStore.collection('userdata').doc(this.uid).set(
          {
            username: this.form.name,
            userEmail: this.email,
            companyName: this.form.company,
            userRole: this.form.role,
            userPhoneNumber: this.form.phone || null
          },
          { merge: true }
        )
        const authUser = this.$fireAuth.currentUser
        if (authUser && authUser.displayName !== this.form.name) {
          await authUser.updateProfile({ displayName: this.form.name })
          this.$store.commit('user/SET_DISPLAY_NAME', this.form.name)
        }
        this.original = { ...this.form }
        this.savedAt = Date.now()
      } catch (err) {
        console.error(err)
        this.$bvToast.toast('Your changes were not saved. Try again.', {
          title: 'Not saved',
          variant: 'danger',
          toaster: 'b-toaster-bottom-left',
          solid: true
        })
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.profile-grid {
  display: grid;
  gap: 24px;
  padding-bottom: 64px;
  align-items: start;
}

.profile-panel {
  padding: 24px;
}

/* While a panel loads it keeps the height it will have, so the page below it does not jump. */
.details-panel.is-loading {
  min-height: 509px;
}

.projects-panel.is-loading {
  min-height: 250px;
}

@media (max-width: 575px) {
  .details-panel.is-loading {
    min-height: 591px;
  }

  .projects-panel.is-loading {
    min-height: 259px;
  }
}

.panel-title {
  font-size: 1.125rem;
  margin: 0 0 20px;
}

.panel-title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

.small-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-size: 0.875rem;
  font-weight: 500;
}

.plaintext-field {
  height: auto;
  padding: 0;
  border: 0;
  color: var(--c-ink);
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.saved-note {
  display: inline-flex;
  align-items: center;
  color: var(--c-success);
  font-size: 0.9375rem;
  font-weight: 500;
}

.muted-line {
  display: flex;
  align-items: center;
  color: var(--c-muted);
  font-size: 0.9375rem;
  margin: 0;
}

.optional {
  color: var(--c-muted);
  font-weight: 400;
}

.project-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--c-line);
}

.project-list li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 4px 16px;
  padding: 0;
  border-bottom: 1px solid var(--c-line);
}

.project-list a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-weight: 500;
}

.project-date {
  color: var(--c-muted);
  font-size: 0.875rem;
}

.member-since {
  margin: 20px 0 0;
  color: var(--c-muted);
  font-size: 0.875rem;
}

@media (min-width: 992px) {
  .profile-grid {
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  }

  .profile-panel {
    padding: 32px;
  }
}
</style>
