<template>
  <div class="app">
    <MapViewer 
      :layerOptions="layers"
    />
  </div>
</template>

<script lang="ts">
import MapViewer from '@/components/MapView/MapViewer.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { type LayerOptions } from '@/types/LayerTypes'; 

export default defineComponent({
  components: {
    MapViewer
  },
  setup() {
    const layers = ref<LayerOptions[]>([]);

    onMounted(()=>{
       layers.value = [
        {
          id: '1212121',
          type: 'wms',
          name: 'topp:states',
          url: 'https://ahocevar.com/geoserver/wms',
          title: 'state',
        }
      ]
    });

    return {
      layers
    };
  }
});
</script>

<style>
.app {
  width: 100vw;
  height: 100vh;
}
</style>