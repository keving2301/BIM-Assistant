<template>
  <div class="workspace" :class="{ 'sidebar-hidden': !sidebarOpen }">
    <aside id="workspace-sidebar" class="sidebar" aria-label="Project">
      <div class="sidebar-head">
        <nuxt-link to="/projects" class="back-link"><b-icon-chevron-left aria-hidden="true" /> Projects</nuxt-link>
        <h1 class="project-name">{{ project ? project.name : projectError ? 'Project not found' : 'Loading project' }}</h1>
        <p v-if="project && project.description" class="project-description">{{ project.description }}</p>
        <b-alert :show="!!projectError" variant="danger" class="mt-3 mb-0">{{ projectError }}</b-alert>
      </div>

      <template v-if="project">
        <section class="sidebar-section">
          <button
            class="section-toggle"
            :aria-expanded="String(sections.models)"
            aria-controls="models-section"
            @click="sections.models = !sections.models"
          >
            <span>Models <span v-if="models" class="section-count">{{ models.length }}</span></span>
            <b-icon-chevron-down class="chevron" aria-hidden="true" />
          </button>
          <b-collapse id="models-section" v-model="sections.models">
            <div class="section-body">
              <input
                ref="file"
                type="file"
                class="visually-hidden"
                :accept="acceptedFiles"
                tabindex="-1"
                aria-hidden="true"
                @change="onFileChosen"
              />
              <div v-if="upload" class="upload-progress" role="status" aria-live="polite">
                <div class="upload-row">
                  <span class="upload-name">{{ upload.name }}</span>
                  <span class="upload-pct">{{ upload.phase === 'uploading' ? `${upload.percent}%` : '' }}</span>
                </div>
                <b-progress :value="upload.phase === 'uploading' ? upload.percent : 100" :animated="upload.phase !== 'uploading'" />
                <p class="upload-phase">{{ upload.phase === 'uploading' ? 'Uploading' : 'Starting the translation' }}</p>
              </div>
              <b-button v-else variant="outline-secondary" block class="upload-button" :disabled="!models" @click="$refs.file.click()">
                <b-icon-cloud-upload aria-hidden="true" class="mr-2" />Upload a model
              </b-button>
              <p class="upload-hint">Revit, IFC, Navisworks, DWG, SketchUp, FBX, OBJ or STEP, up to 150 MB.</p>
              <b-alert :show="!!uploadError" variant="danger" dismissible class="mb-3" @dismissed="uploadError = ''">
                {{ uploadError }}
              </b-alert>

              <p v-if="models === null" class="muted-line"><b-spinner small class="mr-2" />Loading models</p>
              <p v-else-if="modelsError" class="muted-line text-danger">{{ modelsError }}</p>
              <ul v-else-if="models.length" class="model-list">
                <li v-for="model in models" :key="model.objectKey" :class="{ active: model.objectKey === activeKey }">
                  <button
                    class="model-item"
                    :disabled="model.translation.status !== 'success'"
                    :aria-current="model.objectKey === activeKey ? 'true' : null"
                    @click="selectModel(model)"
                  >
                    <span class="model-name">{{ model.objectKey }}</span>
                    <span class="model-meta">
                      <span :class="['status', `status-${label(model).tone}`]">{{ label(model).text }}</span>
                      <span class="model-size">{{ fileType(model.objectKey) }}, {{ formatBytes(model.size) }}</span>
                    </span>
                  </button>
                  <button class="btn-icon model-delete" :aria-label="`Delete ${model.objectKey}`" @click="confirmDeleteModel(model)">
                    <b-icon-trash aria-hidden="true" />
                  </button>
                </li>
              </ul>
              <p v-else class="muted-line">No models yet. Upload one to view it here.</p>
            </div>
          </b-collapse>
        </section>

        <section class="sidebar-section">
          <button
            class="section-toggle"
            :aria-expanded="String(sections.summary)"
            aria-controls="summary-section"
            @click="sections.summary = !sections.summary"
          >
            <span>Model summary</span>
            <b-icon-chevron-down class="chevron" aria-hidden="true" />
          </button>
          <b-collapse id="summary-section" v-model="sections.summary">
            <div class="section-body">
              <p v-if="!index" class="muted-line">
                <template v-if="indexing"><b-spinner small class="mr-2" />Reading the model</template>
                <template v-else>Open a model to see what it contains.</template>
              </p>
              <template v-else>
                <ul class="summary-list">
                  <li v-for="row in summaryRows" :key="row.key">
                    <span class="summary-label">{{ row.label }}</span>
                    <span class="summary-count">{{ row.count.toLocaleString('en-US') }}</span>
                    <button
                      class="btn btn-link btn-sm summary-show"
                      :disabled="!row.count || !row.ids"
                      :aria-label="`Show only the ${row.label.toLowerCase()}`"
                      @click="isolate(row.key)"
                    >
                      Show
                    </button>
                  </li>
                </ul>
                <b-button variant="outline-secondary" size="sm" class="mt-2" :disabled="!isolated" @click="showAll">Show all</b-button>
                <template v-if="index.rooms.length">
                  <h2 class="subheading">Rooms</h2>
                  <ul class="room-list">
                    <li v-for="room in index.rooms" :key="room.dbId">
                      <button class="room-item" @click="focusRoom(room)">
                        <span class="room-name">
                          Room {{ room.label }}<span v-if="room.type" class="room-type">{{ room.type }}</span>
                        </span>
                        <span class="room-area">{{ room.area ? `${room.area.toFixed(1)} m²` : '' }}</span>
                      </button>
                    </li>
                  </ul>
                </template>
              </template>
            </div>
          </b-collapse>
        </section>

        <section class="sidebar-section">
          <button
            class="section-toggle"
            :aria-expanded="String(sections.assistant)"
            aria-controls="assistant-section"
            @click="sections.assistant = !sections.assistant"
          >
            <span>Assistant</span>
            <b-icon-chevron-down class="chevron" aria-hidden="true" />
          </button>
          <b-collapse id="assistant-section" v-model="sections.assistant">
            <div class="section-body">
              <p class="assistant-text">Ask about the open model by chat. Try:</p>
              <ul class="question-list">
                <li v-for="question in suggestedQuestions" :key="question">
                  <button class="question" :disabled="!chatReady" @click="ask(question)">{{ question }}</button>
                </li>
              </ul>
            </div>
          </b-collapse>
        </section>
      </template>
    </aside>

    <div class="stage">
      <button
        class="sidebar-toggle"
        :aria-expanded="String(sidebarOpen)"
        aria-controls="workspace-sidebar"
        @click="sidebarOpen = !sidebarOpen"
      >
        <b-icon-layout-sidebar aria-hidden="true" />
        <span>{{ sidebarOpen ? 'Hide panel' : 'Show panel' }}</span>
      </button>

      <client-only>
        <ModelViewer
          v-if="activeModel"
          :urn="activeModel.urn"
          :get-token="viewerToken"
          @loading="onViewerLoading"
          @loaded="onViewerLoaded"
        />
      </client-only>

      <div v-if="!activeModel" class="stage-empty">
        <template v-if="workingModel">
          <b-spinner class="stage-spinner" label="Translating" />
          <h2>Translating {{ workingModel.objectKey }}</h2>
          <p>Autodesk is converting the file for the browser viewer. This usually takes a few minutes; the model opens here when it is ready.</p>
        </template>
        <template v-else-if="models && models.length">
          <h2>Choose a model</h2>
          <p>Pick a model that is ready to view from the list.</p>
        </template>
        <template v-else-if="models">
          <BrandMark class="stage-mark" />
          <h2>Upload a model to start</h2>
          <p>Add a building model to this project. It is translated for the browser, then you can explore it in 3D and ask the assistant about it.</p>
          <b-button variant="primary" @click="$refs.file.click()"><b-icon-cloud-upload aria-hidden="true" class="mr-2" />Upload a model</b-button>
        </template>
      </div>
    </div>

    <client-only>
      <ChatAssistant ref="chat" :viewer="viewer" :index="index" @ready="chatReady = true" @isolated="isolated = true" />
    </client-only>

    <b-modal
      v-model="deleteOpen"
      :title="deletingModel ? `Delete ${deletingModel.objectKey}?` : 'Delete model?'"
      ok-variant="danger"
      :ok-title="deleteBusy ? 'Deleting' : 'Delete model'"
      cancel-title="Cancel"
      cancel-variant="outline-secondary"
      :ok-disabled="deleteBusy"
      centered
      @ok.prevent="deleteModel"
    >
      <p class="mb-0">The file and its translation are removed from this project. It cannot be undone.</p>
    </b-modal>
  </div>
</template>

<script>
import ModelViewer from '~/components/viewer/ModelViewer.vue'
import ChatAssistant from '~/components/viewer/ChatAssistant.vue'
import { api } from '~/utils/api'
import { formatBytes } from '~/utils/format'
import { ACCEPTED_FILES, fileType, isWorking, translationLabel } from '~/utils/models'
import { buildModelIndex, SUMMARY_KINDS } from '~/utils/model-index'

const MAX_BYTES = 150 * 1024 * 1024
const POLL_MS = 6000

function putPart(url, blob, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    xhr.upload.onprogress = (event) => onProgress(event.loaded)
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status}).`)))
    xhr.onerror = () => reject(new Error('The upload was interrupted. Check your connection and try again.'))
    xhr.send(blob)
  })
}

export default {
  name: 'Viewer',
  components: { ModelViewer, ChatAssistant },
  layout: 'viewer',
  data() {
    return {
      project: null,
      projectError: '',
      models: null,
      modelsError: '',
      activeKey: null,
      upload: null,
      uploadError: '',
      viewer: null,
      index: null,
      indexing: false,
      isolated: false,
      chatReady: false,
      sidebarOpen: true,
      sections: { models: true, summary: true, assistant: true },
      deleteOpen: false,
      deletingModel: null,
      deleteBusy: false,
      acceptedFiles: ACCEPTED_FILES,
      suggestedQuestions: [
        'How many walls are there?',
        'How many doors are there?',
        'How many windows are there?',
        'How many levels are there?',
        'How many rooms are there?',
        'What is the size of room 24?',
        'Explode the model'
      ]
    }
  },
  head() {
    return { title: this.project ? this.project.name : 'Viewer' }
  },
  computed: {
    uid() {
      const data = this.$store.state.user.user.data
      return data && data.uid
    },
    projectId() {
      return this.$route.query.project
    },
    activeModel() {
      return (this.models || []).find((m) => m.objectKey === this.activeKey && m.translation.status === 'success') || null
    },
    workingModel() {
      return (this.models || []).find((m) => isWorking(m.translation)) || null
    },
    summaryRows() {
      if (!this.index) return []
      return SUMMARY_KINDS.map((kind) => ({
        key: kind.key,
        label: kind.label,
        count: kind.key === 'levels' ? this.index.levels.length : (this.index.groups[kind.key] || []).length,
        ids: kind.key === 'levels' ? null : this.index.groups[kind.key]
      }))
    }
  },
  watch: {
    '$route.query.project'() {
      this.reset()
      this.load()
    }
  },
  mounted() {
    if (window.matchMedia('(max-width: 767px)').matches) {
      this.sections = { models: true, summary: false, assistant: false }
    }
    if (this.uid) this.load()
  },
  beforeDestroy() {
    clearTimeout(this.pollTimer)
  },
  methods: {
    formatBytes,
    fileType,
    label(model) {
      return translationLabel(model.translation)
    },
    reset() {
      clearTimeout(this.pollTimer)
      Object.assign(this, { project: null, projectError: '', models: null, modelsError: '', activeKey: null, index: null, viewer: null })
    },
    async load() {
      if (!this.projectId) {
        this.projectError = 'No project was chosen. Go back to your projects and open one.'
        return
      }
      try {
        const doc = await this.$fireStore.collection('userdata').doc(this.uid).collection('buckets').doc(this.projectId).get()
        if (!doc.exists) {
          this.projectError = 'This project does not exist or belongs to another account.'
          return
        }
        this.project = { id: doc.id, ...doc.data() }
      } catch (err) {
        console.error(err)
        this.projectError = 'The project could not be loaded.'
        return
      }
      await this.loadModels()
    },
    async loadModels() {
      this.modelsError = ''
      try {
        const { models } = await api(this.$fireAuth, 'models', { query: { projectId: this.projectId } })
        this.models = models
        const wanted = models.find((m) => m.objectKey === this.$route.query.model && m.translation.status === 'success')
        const ready = wanted || models.find((m) => m.translation.status === 'success')
        if (!this.activeKey && ready) this.activeKey = ready.objectKey
        this.schedulePoll()
      } catch (err) {
        this.models = this.models || []
        this.modelsError = err.message
      }
    },
    schedulePoll() {
      clearTimeout(this.pollTimer)
      if (!(this.models || []).some((m) => isWorking(m.translation))) return
      this.pollTimer = setTimeout(() => this.poll(), POLL_MS)
    },
    async poll() {
      const working = this.models.filter((m) => isWorking(m.translation))
      await Promise.all(
        working.map(async (model) => {
          try {
            const { translation } = await api(this.$fireAuth, 'translate', {
              query: { projectId: this.projectId, objectKey: model.objectKey }
            })
            model.translation = translation
            if (translation.status === 'success') {
              this.$bvToast.toast(`${model.objectKey} is ready to view.`, {
                title: 'Translation finished',
                variant: 'success',
                toaster: 'b-toaster-bottom-left',
                solid: true
              })
              if (!this.activeModel) this.activeKey = model.objectKey
            } else if (translation.status === 'failed' || translation.status === 'timeout') {
              this.$bvToast.toast(`Autodesk could not translate ${model.objectKey}. Check that the file opens in its own application.`, {
                title: 'Translation failed',
                variant: 'danger',
                toaster: 'b-toaster-bottom-left',
                solid: true
              })
            }
          } catch (err) {
            console.error(err)
          }
        })
      )
      this.schedulePoll()
    },
    selectModel(model) {
      if (model.translation.status !== 'success' || model.objectKey === this.activeKey) return
      this.activeKey = model.objectKey
      this.$router.replace({ query: { ...this.$route.query, model: model.objectKey } })
    },
    onFileChosen(event) {
      const file = event.target.files[0]
      event.target.value = ''
      if (file) this.uploadFile(file)
    },
    async uploadFile(file) {
      this.uploadError = ''
      const ext = file.name.split('.').pop().toLowerCase()
      if (!this.acceptedFiles.split(',').includes(`.${ext}`)) {
        this.uploadError = 'This file type cannot be viewed. Choose a Revit, IFC, Navisworks, DWG, SketchUp, FBX, OBJ or STEP file.'
        return
      }
      if (file.size > MAX_BYTES) {
        this.uploadError = 'This file is larger than 150 MB. Upload a smaller model.'
        return
      }
      this.upload = { name: file.name, percent: 0, phase: 'uploading' }
      try {
        const start = await api(this.$fireAuth, 'upload', {
          method: 'POST',
          body: { action: 'start', projectId: this.projectId, fileName: file.name, size: file.size }
        })
        for (let i = 0; i < start.urls.length; i++) {
          const from = i * start.partSize
          const part = file.slice(from, Math.min(file.size, from + start.partSize))
          await putPart(start.urls[i], part, (loaded) => {
            this.upload.percent = Math.min(100, Math.round(((from + loaded) / file.size) * 100))
          })
        }
        this.upload.phase = 'processing'
        const done = await api(this.$fireAuth, 'upload', {
          method: 'POST',
          body: { action: 'complete', projectId: this.projectId, objectKey: start.objectKey, uploadKey: start.uploadKey, size: file.size }
        })
        const entry = { objectKey: done.objectKey, size: file.size, urn: done.urn, translation: { status: 'pending', progress: '0% complete' } }
        this.models = [...this.models.filter((m) => m.objectKey !== done.objectKey), entry].sort((a, b) => a.objectKey.localeCompare(b.objectKey))
        if (this.activeKey === done.objectKey) this.activeKey = null
        this.$fireStore
          .collection('userdata')
          .doc(this.uid)
          .collection('buckets')
          .doc(this.projectId)
          .update({ updatedAt: this.$fireStoreObj.FieldValue.serverTimestamp() })
          .catch((err) => console.error(err))
        this.$bvToast.toast('Autodesk is translating it for the viewer. This usually takes a few minutes.', {
          title: `${done.objectKey} uploaded`,
          variant: 'success',
          toaster: 'b-toaster-bottom-left',
          solid: true
        })
        this.schedulePoll()
      } catch (err) {
        this.uploadError = err.message
      } finally {
        this.upload = null
      }
    },
    confirmDeleteModel(model) {
      this.deletingModel = model
      this.deleteOpen = true
    },
    async deleteModel() {
      const model = this.deletingModel
      if (!model || this.deleteBusy) return
      this.deleteBusy = true
      try {
        await api(this.$fireAuth, 'models', { method: 'DELETE', query: { projectId: this.projectId, objectKey: model.objectKey } })
        this.models = this.models.filter((m) => m.objectKey !== model.objectKey)
        if (this.activeKey === model.objectKey) {
          this.activeKey = null
          this.index = null
          this.viewer = null
        }
        this.deleteOpen = false
        this.$bvToast.toast(`${model.objectKey} was deleted.`, { title: 'Model deleted', toaster: 'b-toaster-bottom-left', solid: true })
      } catch (err) {
        this.$bvToast.toast(err.message, { title: 'The model was not deleted', variant: 'danger', toaster: 'b-toaster-bottom-left', solid: true })
      } finally {
        this.deleteBusy = false
      }
    },
    async viewerToken() {
      return api(this.$fireAuth, 'viewer-token')
    },
    onViewerLoading() {
      this.index = null
      this.isolated = false
    },
    async onViewerLoaded({ viewer, model }) {
      this.viewer = viewer
      this.indexing = true
      try {
        this.index = Object.freeze(await buildModelIndex(model))
        const frame = this.frameIds()
        if (frame) {
          // Frame the building by its doors and windows rather than the whole site (an IFC file can carry its
          // terrain and the neighboring blocks as plain masses), and make that the home view.
          viewer.fitToView(frame, model, true)
          viewer.autocam.setHomeViewFrom(viewer.navigation.getCamera())
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.indexing = false
      }
    },
    frameIds() {
      if (!this.index) return null
      const { walls, doors, windows } = this.index.groups
      const openings = [...doors, ...windows]
      if (openings.length) return openings
      return walls.length ? walls : null
    },
    isolate(key) {
      const ids = this.index && this.index.groups[key]
      if (!this.viewer || !ids || !ids.length) return
      this.viewer.isolate(ids)
      this.viewer.fitToView(ids)
      this.isolated = true
    },
    focusRoom(room) {
      if (!this.viewer) return
      this.viewer.isolate([room.dbId])
      this.viewer.fitToView([room.dbId])
      this.viewer.select([room.dbId])
      this.isolated = true
    },
    showAll() {
      if (!this.viewer) return
      this.viewer.showAll()
      this.viewer.clearSelection()
      this.viewer.explode(0)
      const frame = this.frameIds()
      if (frame) this.viewer.fitToView(frame)
      else this.viewer.fitToView()
      this.isolated = false
    },
    ask(question) {
      if (this.$refs.chat) this.$refs.chat.ask(question)
    }
  }
}
</script>

<style scoped>
.workspace {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  height: calc(100vh - var(--appbar-h) - 1px);
  background: var(--c-canvas);
}

.workspace.sidebar-hidden {
  grid-template-columns: 0 minmax(0, 1fr);
}

.sidebar {
  overflow-y: auto;
  background: var(--c-surface);
  border-right: 1px solid var(--c-line);
  min-width: 0;
}

.sidebar-hidden .sidebar {
  visibility: hidden;
  border-right: 0;
}

.sidebar-head {
  padding: 16px 20px 20px;
  border-bottom: 1px solid var(--c-line);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: -4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--c-ink-2);
  text-decoration: none;
}

.back-link:hover {
  color: var(--c-accent);
}

.project-name {
  font-size: 1.25rem;
  margin: 12px 0 0;
  overflow-wrap: anywhere;
}

.project-description {
  margin: 4px 0 0;
  color: var(--c-ink-2);
  font-size: 0.9375rem;
}

.sidebar-section {
  border-bottom: 1px solid var(--c-line);
}

.section-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 20px;
  border: 0;
  background: transparent;
  font: inherit;
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--c-ink);
  text-align: left;
}

.section-toggle:hover {
  background: #fafbfc;
}

.section-toggle .chevron {
  transition: transform 0.2s ease;
  color: var(--c-muted);
}

.section-toggle[aria-expanded='false'] .chevron {
  transform: rotate(-90deg);
}

.section-count {
  margin-left: 6px;
  color: var(--c-muted);
  font-weight: 500;
}

.section-body {
  padding: 0 20px 20px;
}

.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-hint {
  margin: 8px 0 16px;
  color: var(--c-muted);
  font-size: 0.8125rem;
}

.upload-progress {
  padding: 12px;
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
}

.upload-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.upload-name {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-phase {
  margin: 8px 0 0;
  font-size: 0.8125rem;
  color: var(--c-muted);
}

.muted-line {
  display: flex;
  align-items: center;
  margin: 0;
  color: var(--c-muted);
  font-size: 0.875rem;
}

.model-list,
.summary-list,
.room-list,
.question-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.model-list li {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
  margin-bottom: 8px;
}

.model-list li.active {
  border-color: var(--c-accent);
  background: var(--c-accent-weak);
}

.model-item {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 4px 10px 12px;
  border: 0;
  background: transparent;
  font: inherit;
  text-align: left;
  color: var(--c-ink);
}

.model-item:disabled {
  cursor: default;
}

.model-name {
  font-weight: 500;
  font-size: 0.9375rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.model-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 12px;
}

.model-size {
  font-size: 0.8125rem;
  color: var(--c-muted);
}

.model-delete {
  margin-right: 4px;
  flex: none;
}

.summary-list li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid var(--c-line);
  font-size: 0.9375rem;
}

.summary-label {
  color: var(--c-ink-2);
}

.summary-count {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.summary-show {
  padding: 2px 4px;
  min-width: 44px;
}

.summary-show:disabled {
  visibility: hidden;
}

.subheading {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 20px 0 8px;
}

.room-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 6px 8px;
  margin: 0 -8px;
  width: calc(100% + 16px);
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  font: inherit;
  font-size: 0.9375rem;
  text-align: left;
  color: var(--c-ink);
}

.room-item:hover {
  background: var(--c-canvas);
}

.room-type {
  margin-left: 8px;
  color: var(--c-muted);
  font-size: 0.8125rem;
}

.room-area {
  color: var(--c-ink-2);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.assistant-text {
  margin: 0 0 8px;
  font-size: 0.9375rem;
  color: var(--c-ink-2);
}

.question {
  display: block;
  width: 100%;
  margin-bottom: 6px;
  padding: 7px 12px;
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
  background: var(--c-surface);
  font: inherit;
  font-size: 0.875rem;
  text-align: left;
  color: var(--c-ink);
}

.question:hover:not(:disabled) {
  border-color: var(--c-accent);
  color: var(--c-accent);
}

.question:disabled {
  color: var(--c-muted);
}

.stage {
  position: relative;
  min-width: 0;
  min-height: 0;
}

.sidebar-toggle {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
  background: var(--c-surface);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--c-ink);
}

.sidebar-toggle:hover {
  border-color: var(--c-line-strong);
}

.stage-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
}

.stage-empty h2 {
  font-size: 1.25rem;
  margin: 16px 0 8px;
}

.stage-empty p {
  max-width: 440px;
  color: var(--c-ink-2);
  margin-bottom: 24px;
}

.stage-mark {
  width: 48px;
  height: 48px;
  color: var(--c-accent);
}

.stage-spinner {
  color: var(--c-accent);
}

@media (max-width: 767px) {
  .workspace,
  .workspace.sidebar-hidden {
    display: flex;
    flex-direction: column;
    height: auto;
  }

  .stage {
    order: -1;
    height: 58vh;
    min-height: 360px;
    border-bottom: 1px solid var(--c-line);
  }

  .sidebar,
  .sidebar-hidden .sidebar {
    visibility: visible;
    overflow: visible;
    border-right: 0;
    /* Room to scroll the last section clear of the chat button. */
    padding-bottom: 88px;
  }

  .sidebar-toggle {
    display: none;
  }
}
</style>
