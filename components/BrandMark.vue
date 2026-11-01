<template>
  <!-- A building block drawn in isometric with its storey lines: the product's mark. -->
  <svg
    class="brand-mark"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linejoin="round"
    stroke-linecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2.75 20.25 7.4v9.2L12 21.25 3.75 16.6V7.4L12 2.75Z" />
    <path d="M3.75 7.4 12 12.05l8.25-4.65M12 12.05v9.2" />
    <path d="M3.75 10.45 12 15.1M3.75 13.5 12 18.15" />
  </svg>
</template>

<script>
export default { name: 'BrandMark' }
</script>

<style scoped>
.brand-mark {
  width: 28px;
  height: 28px;
  flex: none;
}
</style>
