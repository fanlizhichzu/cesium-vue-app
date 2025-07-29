<template>
  <div class="app">
    <BasicTree :data="treeStore.treeData" :default-props="defaultProps" :lazy="false" @node-click="handleNodeClick" />
    <MapViewer :layerOptions="treeStore.layers" />
  </div>
</template>

<script lang="ts" setup>
import MapViewer from '@/components/MapView/MapViewer.vue';
import BasicTree from './Tree/BasicTree.vue';
import { onMounted, ref, computed, watch, nextTick} from 'vue';
import type { TreeNode } from '@/types/treeTypes';
import { useTree } from '@/composables/useTree';


const { loadTreeData, treeStore } = useTree();

onMounted(async () => {
  try {
    
    await loadTreeData();

  } catch (error) {
    console.error('Error in onMounted:', error); // 检查是否有报错
  }
});

const handleNodeClick = (data: TreeNode) => {

  if (data.type != 'directory') {
    data.label = 'aaaaa';
    data.config = JSON.stringify({
      type: 'wms',
      url: 'https://example.com/vector-layer',
    });
  }

  
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