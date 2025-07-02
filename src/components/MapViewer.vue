<template>
  <div id="mapCesium" class="map"></div>
  <button id="enable" @click="toggle3D" class="toggle-button">Toggle 3D</button>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import 'ol/ol.css';
import { MapManager } from '../map/mapManager';

export default defineComponent({
  name: 'MapComponent',
  setup() {
    const mapManager = ref<MapManager | null>(null);
    const is3d = ref(false);

    const toggle3D = () => {
      if (mapManager.value) {
        mapManager.value.toggle3DView(!is3d.value);
      }
    };

    onMounted(async () => {
      console.log('Initializing MapManager...');
      mapManager.value = new MapManager('mapCesium');
      await mapManager.value.initCesiumMap();
      
      // 示例：添加更多图层
      // mapManager.value.add2DLayer('tile', new OSM());
      // mapManager.value.add3DLayer('path/to/3d/tileset.json');
    });

    onUnmounted(() => {
      if (mapManager.value) {
        mapManager.value.destroy();
      }
    });

    return { toggle3D };
  },
});
</script>

<style scoped>
.map {
  width: 100%;
  height: 100vh;
}

.toggle-button {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 10px 20px;
  background-color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.toggle-button:hover {
  background-color: #f0f0f0;
}
</style>