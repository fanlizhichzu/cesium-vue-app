<!-- src/components/CesiumViewer.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Viewer,  CesiumTerrainProvider } from 'cesium'
import { initCesium } from "@/lib/cesium/init";

const CESIUM_ION_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOTc4YTk0OS04Yzc0LTQ0NGItYmQ5Mi1mZDRiNTcwOTVmODEiLCJpZCI6MTc1NTUyLCJpYXQiOjE2OTg5MDU3NjF9.VPB-f81rQRFA72amiP_ja9CZvP4uSfTqLc2zRXAMPzM";

const {loadBaseViewer} = initCesium(CESIUM_ION_TOKEN);

const props = defineProps<{
  terrain?: boolean
  timeline?: boolean
}>()

const containerRef = ref<HTMLElement | null>(null);
let viewer: Viewer | null = null

onMounted(async () => {
  if (!containerRef.value) return;
  viewer = await loadBaseViewer(containerRef.value, 1, {timeline: props.timeline ?? true});
  console.log("Cesium Viewer initialized", viewer);
  
})

defineExpose({ viewer })
</script>

<template>
  <div ref="containerRef" class="cesium-container" />
</template>

<style scoped>
.cesium-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>