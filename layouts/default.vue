<template>
  <div class="layout">
    <AppBar />
    <main id="main" class="layout-main" tabindex="-1">
      <Nuxt />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-main {
  flex: 1 0 auto;
  outline: none;
}
</style>
