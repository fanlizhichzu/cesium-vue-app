<template>
  <div id="mapCesium" class="mapCesium"></div>
  <button id="enable" @click="toggle3D" class="toggle-button">Toggle 3D</button>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { MapManager } from '@/components/MapView/map/mapManager';
import {type LayerOptions} from '@/types/LayerTypes';

export default defineComponent({
  name: 'MapComponent',
  props: {
    layerOptions: {
      type: Array as () => LayerOptions[],
      default: () => []
    }
  }, 
  setup(props) {
    let mapManager: MapManager;

    const toggle3D = () => {
      if (mapManager) {
        mapManager.toggle3DView();
      }
    };

    onMounted(async () => {
      console.log('Initializing MapManager...');
      mapManager = new MapManager('mapCesium');
      await mapManager.initCesiumMap();

      // 示例：添加更多图层
      props.layerOptions.forEach((layer) => {
        mapManager.addLayer(layer);
      });

    });

    onUnmounted(() => {
      if (mapManager) {
        mapManager.destroy();
      }
    });

    return { toggle3D };
  },
});
</script>

<style scoped>
.mapCesium {
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