<template>
  <footer><p> {{ footerText }}</p></footer>
</template>

<script>
export default {
  name: 'footer',
  data() {
    return {
      footerText: '© 2020 BIM Assistant. All rights reserved.'
    }
  }
}
</script>

<style scoped>
html, body {
  height: 100%;
}

body {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  min-height: 100vh;
}

p {
  margin-bottom: 0;
  font-size: 15px;
}

footer {
  padding: 1.8rem 0;
  background-color: transparent;
  flex-shrink: 0;
  text-align: center;
  color: white;
  height: 50px;
}
</style>