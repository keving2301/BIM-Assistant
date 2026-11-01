<template>
  <article class="project-card panel">
    <div class="project-thumb" :class="{ empty: !thumbnail }">
      <img v-if="thumbnail" :src="thumbnail" :alt="`Preview of ${project.name}`" />
      <div v-else class="thumb-placeholder" aria-hidden="true">
        <BrandMark />
      </div>
    </div>
    <div class="project-body">
      <div class="project-title-row">
        <h3 class="project-title">
          <nuxt-link :to="{ path: '/viewer', query: { project: project.id } }" class="stretched-link">{{ project.name }}</nuxt-link>
        </h3>
        <b-dropdown
          right
          variant="link"
          toggle-class="btn-icon"
          no-caret
          class="project-menu"
          :aria-label="`Actions for ${project.name}`"
        >
          <template #button-content>
            <b-icon-three-dots aria-hidden="true" />
            <span class="visually-hidden">Actions for {{ project.name }}</span>
          </template>
          <b-dropdown-item :to="{ path: '/viewer', query: { project: project.id } }">Open</b-dropdown-item>
          <b-dropdown-item link-class="text-danger" @click="$emit('delete', project)">Delete project</b-dropdown-item>
        </b-dropdown>
      </div>
      <p v-if="project.description" class="project-description">{{ project.description }}</p>
      <div class="project-meta">
        <span v-if="models === null" class="status">Checking models</span>
        <span v-else-if="!models.length" class="status">No model uploaded</span>
        <span v-else :class="['status', `status-${label.tone}`]">
          {{ label.text }}<template v-if="models.length > 1">, {{ models.length }} models</template>
        </span>
        <span class="project-date">Created {{ created }}</span>
      </div>
    </div>
  </article>
</template>

<script>
import { formatDate } from '~/utils/format'
import { translationLabel } from '~/utils/models'

export default {
  name: 'ProjectCard',
  props: {
    project: { type: Object, required: true },
    // null while loading, then the project's models from the server
    models: { type: Array, default: null },
    thumbnail: { type: String, default: null }
  },
  computed: {
    created() {
      return formatDate(this.project.createdAt)
    },
    primary() {
      return (this.models || []).find((m) => m.translation.status === 'success') || (this.models || [])[0]
    },
    label() {
      return translationLabel(this.primary && this.primary.translation)
    }
  }
}
</script>

<style scoped>
.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.15s ease;
}

.project-card:hover,
.project-card:focus-within {
  border-color: var(--c-line-strong);
}

.project-thumb {
  aspect-ratio: 16 / 10;
  background: #eef0f5;
  border-bottom: 1px solid var(--c-line);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.project-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #fff;
}

.thumb-placeholder .brand-mark {
  width: 56px;
  height: 56px;
  color: #b9bfd0;
}

.project-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 16px 20px 20px;
  flex: 1;
}

.project-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.project-title {
  font-size: 1.0625rem;
  margin: 6px 0 0;
  min-width: 0;
  overflow-wrap: anywhere;
}

.project-title a {
  color: var(--c-ink);
  text-decoration: none;
}

.project-title a:focus-visible {
  outline: none;
}

.project-title a:focus-visible::after {
  outline: 2px solid var(--c-accent);
  outline-offset: -2px;
  border-radius: var(--radius-lg);
}

.project-menu {
  position: relative;
  z-index: 2;
  margin-right: -4px;
}

.project-description {
  margin: 0;
  color: var(--c-ink-2);
  font-size: 0.9375rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
  margin-top: auto;
  padding-top: 8px;
}

.project-date {
  color: var(--c-muted);
  font-size: 0.8125rem;
}
</style>
