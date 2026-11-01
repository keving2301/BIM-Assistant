<template>
  <div class="model-viewer">
    <div ref="container" class="model-viewer-canvas" />
    <div v-if="status !== 'ready'" class="model-viewer-overlay" role="status" aria-live="polite">
      <template v-if="status === 'error'">
        <b-icon-exclamation-triangle-fill class="overlay-icon text-danger" aria-hidden="true" />
        <p class="overlay-title">The model could not be displayed</p>
        <p class="overlay-text">{{ error }}</p>
      </template>
      <template v-else>
        <b-spinner class="overlay-spinner" label="Loading" />
        <p class="overlay-title">{{ status === 'starting' ? 'Starting the viewer' : 'Loading the model' }}</p>
      </template>
    </div>
  </div>
</template>

<script>
// The Autodesk Platform Services viewer (version 7) showing one translated model (SVF2). The viewer asks
// getToken for a viewables:read token whenever it needs one.
import { loadScript, loadStyle } from '~/utils/load-script'

const VIEWER_BASE = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*'
let initialized = null

function initializeViewer(getAccessToken) {
  if (!initialized) {
    initialized = Promise.all([loadStyle(`${VIEWER_BASE}/style.min.css`), loadScript(`${VIEWER_BASE}/viewer3D.min.js`)]).then(
      () =>
        new Promise((resolve) => {
          window.Autodesk.Viewing.Initializer({ env: 'AutodeskProduction2', api: 'streamingV2', getAccessToken }, resolve)
        })
    )
    initialized.catch(() => {
      initialized = null
    })
  }
  return initialized
}

export default {
  name: 'ModelViewer',
  props: {
    urn: { type: String, required: true },
    // () => Promise<{ access_token, expires_in }>
    getToken: { type: Function, required: true }
  },
  data() {
    return { status: 'starting', error: '' }
  },
  watch: {
    urn() {
      this.loadModel()
    }
  },
  async mounted() {
    // The Initializer keeps the first callback it receives, so route every token request through a stable function.
    window.__bimvaGetToken = this.getToken
    try {
      await initializeViewer((onTokenReady) => {
        window.__bimvaGetToken()
          .then((token) => onTokenReady(token.access_token, token.expires_in))
          .catch((err) => this.fail(err.message))
      })
    } catch (err) {
      this.fail('The Autodesk viewer could not be loaded. Check your connection and reload the page.')
      return
    }
    if (this._isDestroyed) return
    const Viewing = window.Autodesk.Viewing
    this.viewer = new Viewing.GuiViewer3D(this.$refs.container, { extensions: [] })
    this.viewer.start()
    this.viewer.setTheme('light-theme')
    this.viewer.setBackgroundColor(244, 245, 248, 244, 245, 248)
    this.viewer.setGroundShadow(true)
    this.viewer.addEventListener(Viewing.SELECTION_CHANGED_EVENT, (event) => this.$emit('selection', event.dbIdArray))
    this.loadModel()
  },
  beforeDestroy() {
    if (this.viewer) {
      this.viewer.finish()
      this.viewer = null
    }
  },
  methods: {
    fail(message) {
      this.status = 'error'
      this.error = message
      this.$emit('error', message)
    },
    loadModel() {
      if (!this.viewer) return
      const Viewing = window.Autodesk.Viewing
      const urn = this.urn
      this.status = 'loading'
      this.$emit('loading')
      Viewing.Document.load(
        `urn:${urn}`,
        async (doc) => {
          if (urn !== this.urn || !this.viewer) return
          const node = doc.getRoot().getDefaultGeometry()
          if (!node) {
            this.fail('This model has no 3D or 2D views to show.')
            return
          }
          try {
            if (this.model) this.viewer.unloadModel(this.model)
            const model = await this.viewer.loadDocumentNode(doc, node)
            this.model = model
            await this.viewer.waitForLoadDone({ propDb: true, geometry: true })
            if (urn !== this.urn) return
            this.status = 'ready'
            this.$emit('loaded', { viewer: this.viewer, model })
          } catch (err) {
            console.error(err)
            this.fail('The model views could not be loaded.')
          }
        },
        (code, message) => {
          console.error('Document load failed', code, message)
          this.fail(code === 4 ? 'This model is not available to your account.' : `The viewer reported error ${code}.`)
        }
      )
    }
  }
}
</script>

<style scoped>
.model-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f4f5f8;
}

.model-viewer-canvas {
  position: absolute;
  inset: 0;
}

.model-viewer-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  background: #f4f5f8;
}

.overlay-spinner {
  color: var(--c-accent);
  width: 28px;
  height: 28px;
  border-width: 3px;
}

.overlay-icon {
  width: 28px;
  height: 28px;
}

.overlay-title {
  margin: 8px 0 0;
  font-weight: 600;
}

.overlay-text {
  margin: 0;
  max-width: 420px;
  color: var(--c-ink-2);
  font-size: 0.9375rem;
}
</style>
