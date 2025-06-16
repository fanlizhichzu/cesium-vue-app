<!-- src/components/CesiumViewer.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Viewer,  CesiumTerrainProvider } from 'cesium'

const props = defineProps<{
  terrain?: boolean
  timeline?: boolean
}>()

const containerRef = ref<HTMLElement>()
let viewer: Viewer | null = null

onMounted(async () => {
  viewer = new Viewer(containerRef.value!, {
    terrainProvider: props.terrain 
      ? await CesiumTerrainProvider.fromIonAssetId(3956, {
      requestVertexNormals: true
    }): undefined,
    timeline: props.timeline ? true : false,
    animation: false
  })
})

defineExpose({ viewer })
</script>

<template>
  <div ref="containerRef" class="cesium-container" />
</template>

<style scoped>
.cesium-container {
  width: 100%;
  height: 100vh;
}
</style>