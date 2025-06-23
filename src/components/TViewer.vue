<template>
  <MapViewer :engine-type="currentEngine" :layers="[
    {
      type: LayerType.GeoJSON,
      data: geoJsonData,
      options: { id: 'area', name: 'Demo Area', visible: true, value: 1 }
    }
  ]" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MapViewer from './MapViewer.vue';
import { EngineType, LayerType } from '../lib/layer/types';

const currentEngine = ref(EngineType.LEAFLET);
const geoJsonData = ref({
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [116.404, 39.915]
      },
      "properties": {
        "name": "天安门",
        "type": "monument"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [116.404, 39.915],
          [116.414, 39.925],
          [116.424, 39.935]
        ]
      },
      "properties": {
        "name": "长安街",
        "highway": true
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [116.404, 39.915],
            [116.414, 39.915],
            [116.414, 39.925],
            [116.404, 39.925],
            [116.404, 39.915]
          ]
        ]
      },
      "properties": {
        "name": "故宫区域",
        "area": 0.72
      }
    }
  ]
});
</script>