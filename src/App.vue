<script setup lang="ts">
</script>

<template>
  <div class="main">
    <router-view class="main-content" />
  </div>
</template>

<style scoped>
.main {
  padding-top: env(safe-area-inset-top);
}

.main-content {
  height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  overflow-y: auto;
}
</style>