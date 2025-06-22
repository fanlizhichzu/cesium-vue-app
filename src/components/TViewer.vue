<template>
  <MapViewer 
    :engine-type="currentEngine" 
    :layers="[
      {
        type: LayerType.GeoJSON,
        data: geoJsonData,
        options: { id: 'area', name: 'Demo Area' ,visible: true, value: 1 }
      }
    ]" 
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MapViewer from './MapViewer.vue';
import { EngineType, LayerType } from '../lib/layer/types';

const currentEngine = ref(EngineType.CESIUM);
const geoJsonData = ref( {
        type: LayerType.GeoJSON,
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [[[116.3, 39.9], [116.4, 39.9], [116.4, 40.0], [116.3, 40.0], [116.3, 39.9]]]
              }
            }
          ]
        },
        options: {
          id: 'beijing-polygon',
          name: 'Beijing Area'
        }
      },);
</script>