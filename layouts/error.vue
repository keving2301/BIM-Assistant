<template>
  <div class="app-canvas error-page">
    <div class="page-container error-inner">
      <h1>{{ error.statusCode === 404 ? 'Page not found' : 'The page could not be shown' }}</h1>
      <p class="error-text">
        {{ error.statusCode === 404 ? 'Check the address, or go back to the start.' : 'Reload the page, or go back to the start.' }}
      </p>
      <b-button to="/" variant="primary">Go to the home page</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  props: {
    error: { type: Object, required: true }
  },
  head() {
    return { title: this.error.statusCode === 404 ? 'Page not found' : 'Error' }
  }
}
</script>

<style scoped>
.error-inner {
  max-width: 640px;
  padding-top: 96px;
  padding-bottom: 120px;
}

.error-text {
  color: var(--c-ink-2);
  margin: 12px 0 28px;
}
</style>
