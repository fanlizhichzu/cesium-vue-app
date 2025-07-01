<template>
  <div class="app">
    <MapViewer 
      :center="[116.4, 39.9]" 
      :zoom="12"
      :layers="[
        {
          id: 'base-layer',
          type: 'raster',
          source: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        },
        {
          id: 'vector-layer',
          type: 'vector',
          source: 'https://geojson.cn/api/china/1.6.2/china.topo.json'
        }
      ]"
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