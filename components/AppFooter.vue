<template>
  <footer class="footer">
    <div class="page-container footer-inner">
      <p class="footer-name">
        <BrandMark />
        BIM Virtual Assistant
      </p>
      <p class="footer-note">
        Models are translated and displayed with Autodesk Platform Services. The chat runs on Dialogflow.
      </p>
    </div>
  </footer>
</template>

<script>
export default { name: 'AppFooter' }
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--c-line);
  background: var(--c-surface);
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 24px;
  padding-top: 24px;
  padding-bottom: 24px;
}

.footer-inner p {
  margin: 0;
}

.footer-name {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
}

.footer-name .brand-mark {
  width: 22px;
  height: 22px;
  color: var(--c-accent);
}

.footer-note {
  color: var(--c-muted);
  font-size: 0.875rem;
}
</style>
