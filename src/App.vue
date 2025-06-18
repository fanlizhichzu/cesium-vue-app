<script setup lang="ts">
import CesiumViewer from './components/CesiumViewer.vue'
</script>

<template>
    <div style="width: 100%; height: 100%; position: absolute;">
    <CesiumViewer :timeline="true" />
  </div>

</template>

<style scoped>
</style>
