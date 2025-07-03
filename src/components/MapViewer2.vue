<template>
  <div id="mapCesium" class="map"></div>
  <button id="enable" @click="toggleOl3d">Toggle 3D</button>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import ImageLayer from 'ol/layer/Image';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ImageWMS from 'ol/source/ImageWMS';
import OLCesium from 'olcs';
import * as Cesium from 'cesium';
import { OLMap } from '@/map/olMap';
import { CesiumMap } from '@/map/cesiumMap';


export default defineComponent({
  name: 'MapComponent',
  setup() {
    let ol3d: any = null;

    const toggleOl3d = () => {
      if (ol3d) {
        ol3d.setEnabled(!ol3d.getEnabled());
      }
    };

    onMounted(() => {
      window.Cesium = Cesium;
      const ol2d = new OLMap('mapCesium');

      ol3d = new OLCesium({ map: ol2d.getMapInstance() });
      ol3d.getCesiumScene();
      ol3d.setEnabled(true);
    });

    return { toggleOl3d };
  },
});
</script>

<style scoped>
.map {
  width: 100%;
  height: 90vh; /* 调整高度以留出空间给按钮 */
}

/* 设置按钮样式 */
.toggle-button {
  position: absolute;
  top: 10px; /* 距离顶部的距离 */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 完成水平居中 */
  z-index: 1000; /* 确保按钮在地图上方 */
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