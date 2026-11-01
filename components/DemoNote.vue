<template>
  <div v-if="shown && isDemo" class="demo-note" :class="{ compact }" role="note">
    <p class="demo-note-text">
      <strong>Demo account.</strong>
      <slot>
        You can open the projects, the 3D model, its summary and the chat. Creating and deleting projects, uploading
        models and editing the profile are turned off here.
      </slot>
    </p>
    <b-button variant="outline-secondary" size="sm" class="demo-note-action" @click="createOwn">
      Create your own account
    </b-button>
  </div>
</template>

<script>
// A calm, single notice that the signed-in account is the public demo, and what it cannot do. The server enforces
// the same limits (netlify/lib/demo.mjs and firestore.rules); this only explains them.
export default {
  name: 'DemoNote',
  props: {
    // The narrow variant for the viewer's side panel.
    compact: { type: Boolean, default: false }
  },
  data() {
    // Rendered after mount so the prerendered HTML (which cannot know who is signed in) matches the first render.
    return { shown: false }
  },
  computed: {
    isDemo() {
      return this.$store.getters['user/isDemo']
    }
  },
  mounted() {
    this.shown = true
  },
  methods: {
    async createOwn() {
      await this.$fireAuth.signOut()
      this.$router.push('/sign_up')
    }
  }
}
</script>

<style scoped>
.demo-note {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  margin-bottom: 24px;
  padding: 12px 16px;
  border: 1px solid #c9cfec;
  border-radius: var(--radius);
  background: var(--c-accent-weak);
}

.demo-note-text {
  flex: 1 1 320px;
  margin: 0;
  color: var(--c-ink-2);
  font-size: 0.9375rem;
}

.demo-note.compact {
  margin: 16px 20px 0;
  padding: 12px;
  gap: 8px;
}

.demo-note.compact .demo-note-text {
  flex-basis: 100%;
  font-size: 0.875rem;
}

.demo-note-text strong {
  color: var(--c-ink);
  font-weight: 600;
}
</style>
