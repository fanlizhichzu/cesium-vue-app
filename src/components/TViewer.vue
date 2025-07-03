<template>
  <div class="app">
    <MapViewer 
      
    />
  </div>
</template>

<script lang="ts">
import MapViewer from '@/components/MapViewer.vue';

export default {
  components: {
    MapViewer
  }
};
</script>

<style>
.app {
  width: 100vw;
  height: 100vh;
}
</style>