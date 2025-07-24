<template>
  <div class="app">
    <BasicTree :data="treeData" :default-props="defaultProps" :lazy="false" @node-click="handleNodeClick" />
    <MapViewer :layerOptions="layers" />
  </div>
</template>

<script lang="ts" setup>
import MapViewer from '@/components/MapView/MapViewer.vue';
import BasicTree from './Tree/BasicTree.vue';
import { onMounted, ref } from 'vue';
import { type LayerOptions } from '@/types/LayerTypes';
import type { TreeNode } from '@/types/treeTypes';
import { useTree } from '@/composables/useTree';

const layers = ref<LayerOptions[]>([]);
const treeData = ref<TreeNode[]>([]);

const { loadTreeData, treeStore } = useTree();

onMounted(async () => {
  // Initialize tree data
  await loadTreeData();
  treeData.value = treeStore.treeData;

  layers.value = [
    {
      id: '1212121',
      type: 'wms',
      name: 'ne:countries',
      url: 'http://117.72.46.51:8000/geoserver/ne/wms',
      title: 'contry',
    }
  ]
});

const handleNodeClick = (data: TreeNode) => {
  console.log(data)
}

const defaultProps = {
  children: 'children',
  label: 'label',
}
</script>

<style>
.app {
  width: 100vw;
  height: 100vh;
}
</style>