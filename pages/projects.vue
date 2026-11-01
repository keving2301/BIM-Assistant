<template>
  <div class="app-canvas">
    <div class="page-container">
      <header class="page-header">
        <div>
          <h1>Projects</h1>
          <p>Each project holds the models of one building.</p>
        </div>
        <b-button v-if="projects && projects.length" variant="primary" @click="openCreate">
          <b-icon-plus aria-hidden="true" class="mr-1" />New project
        </b-button>
      </header>

      <b-alert :show="!!loadError" variant="danger" role="alert">
        {{ loadError }}
        <b-button variant="link" class="alert-link p-0 ml-2 align-baseline" @click="load">Try again</b-button>
      </b-alert>

      <div v-if="projects === null && !loadError" class="project-grid" aria-busy="true" aria-label="Loading projects">
        <div v-for="n in 3" :key="n" class="panel skeleton-card">
          <div class="skeleton-thumb" />
          <div class="skeleton-line w-50" />
          <div class="skeleton-line w-75" />
        </div>
      </div>

      <section v-else-if="projects && !projects.length" class="panel empty-state">
        <b-icon-folder-plus class="empty-icon" aria-hidden="true" />
        <h2>No projects yet</h2>
        <p>Create a project, then upload a Revit, IFC or other model file to explore it in 3D and ask the assistant about it.</p>
        <b-button variant="primary" @click="openCreate">Create a project</b-button>
      </section>

      <div v-else-if="projects" class="project-grid">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          :models="models[project.id] === undefined ? null : models[project.id]"
          :thumbnail="thumbnails[project.id] || null"
          @delete="confirmDelete"
        />
      </div>
    </div>

    <b-modal
      id="create-project"
      v-model="createOpen"
      title="New project"
      :ok-title="creating ? 'Creating' : 'Create project'"
      cancel-title="Cancel"
      cancel-variant="outline-secondary"
      :ok-disabled="creating"
      :cancel-disabled="creating"
      :no-close-on-backdrop="creating"
      centered
      @ok.prevent="createProject"
      @shown="$refs.projectName.focus()"
    >
      <b-alert :show="!!createError" variant="danger" role="alert">{{ createError }}</b-alert>
      <b-form novalidate @submit.prevent="createProject">
        <b-form-group label="Project name" label-for="project-name" :state="nameState" :invalid-feedback="nameError">
          <b-form-input
            id="project-name"
            ref="projectName"
            v-model.trim="draft.name"
            maxlength="60"
            :state="nameState"
            @blur="draftTouched = true"
          />
        </b-form-group>
        <b-form-group label-for="project-description" description="A line about the building, shown on the project card.">
          <template #label>Description <span class="optional">(optional)</span></template>
          <b-form-textarea id="project-description" v-model.trim="draft.description" rows="2" maxlength="200" no-resize />
        </b-form-group>
      </b-form>
    </b-modal>

    <b-modal
      id="delete-project"
      v-model="deleteOpen"
      :title="deleting ? `Delete ${deleting.name}?` : 'Delete project?'"
      ok-variant="danger"
      :ok-title="deleteBusy ? 'Deleting' : 'Delete project'"
      cancel-title="Cancel"
      cancel-variant="outline-secondary"
      :ok-disabled="deleteBusy"
      :cancel-disabled="deleteBusy"
      centered
      @ok.prevent="deleteProject"
    >
      <p class="mb-0">This deletes the project, its uploaded models and their translations. It cannot be undone.</p>
    </b-modal>
  </div>
</template>

<script>
import { api } from '~/utils/api'

export default {
  name: 'Projects',
  data() {
    return {
      projects: null,
      models: {},
      thumbnails: {},
      loadError: '',
      createOpen: false,
      creating: false,
      createError: '',
      draft: { name: '', description: '' },
      draftTouched: false,
      deleteOpen: false,
      deleting: null,
      deleteBusy: false
    }
  },
  head: {
    title: 'Projects'
  },
  computed: {
    uid() {
      const data = this.$store.state.user.user.data
      return data && data.uid
    },
    nameError() {
      if (!this.draft.name) return 'Enter a project name.'
      const taken = (this.projects || []).some((p) => p.name.toLowerCase() === this.draft.name.toLowerCase())
      return taken ? 'You already have a project with this name.' : ''
    },
    nameState() {
      return this.draftTouched && this.nameError ? false : null
    }
  },
  mounted() {
    if (this.uid) this.load()
  },
  beforeDestroy() {
    Object.values(this.thumbnails).forEach((url) => URL.revokeObjectURL(url))
  },
  methods: {
    collection() {
      return this.$fireStore.collection('userdata').doc(this.uid).collection('buckets')
    },
    async load() {
      this.loadError = ''
      try {
        const snapshot = await this.collection().orderBy('createdAt', 'desc').get()
        this.projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        this.projects.forEach((project) => this.loadModels(project))
      } catch (err) {
        console.error(err)
        this.loadError = 'Your projects could not be loaded.'
      }
    },
    async loadModels(project) {
      try {
        const { models } = await api(this.$fireAuth, 'models', { query: { projectId: project.id } })
        this.$set(this.models, project.id, models)
        const ready = models.find((m) => m.translation.status === 'success' && m.translation.hasThumbnail)
        if (ready && !this.thumbnails[project.id]) {
          const blob = await api(this.$fireAuth, 'thumbnail', { query: { projectId: project.id, objectKey: ready.objectKey } })
          this.$set(this.thumbnails, project.id, URL.createObjectURL(blob))
        }
      } catch (err) {
        console.error(err)
        this.$set(this.models, project.id, [])
      }
    },
    openCreate() {
      this.draft = { name: '', description: '' }
      this.draftTouched = false
      this.createError = ''
      this.createOpen = true
    },
    async createProject() {
      this.draftTouched = true
      if (this.nameError || this.creating) return
      this.creating = true
      this.createError = ''
      const doc = this.collection().doc()
      try {
        // The bucket first: the server checks the project limit before anything is saved.
        await api(this.$fireAuth, 'projects', { method: 'POST', body: { projectId: doc.id } })
        const now = this.$fireStoreObj.FieldValue.serverTimestamp()
        await doc.set({ name: this.draft.name, description: this.draft.description || '', createdAt: now, updatedAt: now })
        this.createOpen = false
        this.$bvToast.toast(`${this.draft.name} is ready for its first model.`, {
          title: 'Project created',
          variant: 'success',
          toaster: 'b-toaster-bottom-left',
          solid: true
        })
        this.$router.push({ path: '/viewer', query: { project: doc.id } })
      } catch (err) {
        this.createError = err.message
      } finally {
        this.creating = false
      }
    },
    confirmDelete(project) {
      this.deleting = project
      this.deleteOpen = true
    },
    async deleteProject() {
      const project = this.deleting
      if (!project || this.deleteBusy) return
      this.deleteBusy = true
      try {
        await api(this.$fireAuth, 'projects', { method: 'DELETE', query: { projectId: project.id } })
        await this.collection().doc(project.id).delete()
        this.projects = this.projects.filter((p) => p.id !== project.id)
        this.deleteOpen = false
        this.$bvToast.toast(`${project.name} and its models were deleted.`, {
          title: 'Project deleted',
          toaster: 'b-toaster-bottom-left',
          solid: true
        })
      } catch (err) {
        this.$bvToast.toast(err.message, { title: 'The project was not deleted', variant: 'danger', toaster: 'b-toaster-bottom-left', solid: true })
      } finally {
        this.deleteBusy = false
      }
    }
  }
}
</script>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding-bottom: 64px;
}

.empty-state {
  max-width: 560px;
  margin: 24px auto 64px;
  padding: 48px 32px;
  text-align: center;
}

.empty-state h2 {
  font-size: 1.25rem;
  margin-top: 16px;
}

.empty-state p {
  color: var(--c-ink-2);
  margin-bottom: 24px;
}

.empty-icon {
  width: 40px;
  height: 40px;
  color: var(--c-accent);
}

.skeleton-card {
  padding-bottom: 20px;
  overflow: hidden;
}

.skeleton-thumb {
  aspect-ratio: 16 / 10;
  background: #eceef3;
  margin-bottom: 16px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: #eceef3;
  margin: 12px 20px 0;
}

.optional {
  color: var(--c-muted);
  font-weight: 400;
}

@media (max-width: 575px) {
  .project-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
