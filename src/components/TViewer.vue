<template>
  <div class="app">
    <BasicTree :data="data" :default-props="defaultProps" :lazy="false" @node-click="handleNodeClick" />
    <MapViewer :layerOptions="layers" />
  </div>
</template>

<script lang="ts">
import MapViewer from '@/components/MapView/MapViewer.vue';
import BasicTree from './Tree/BasicTree.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { type LayerOptions } from '@/types/LayerTypes';
import type { TreeNode } from '@/types/treeTypes';

export default defineComponent({
  components: {
    MapViewer
  },
  setup() {
    const layers = ref<LayerOptions[]>([]);

    onMounted(() => {
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

    const data: TreeNode[] = [
      {
        id: 1,
        label: '一级 111111111111111111111111111111111111',
        type: 'department',
        icon: 'Edit',
        children: [
          {
            id: 4,
            label: '二级 1-1',
            type: 'department',
            children: [
              { id: 9, label: '三级 1-1-1', type: 'user', status: 'online' },
              { id: 10, label: '三级 1-1-2', type: 'user', status: 'offline' }
            ]
          }
        ]
      }
    ]

    const defaultProps = {
      children: 'children',
      label: 'label',
    }

    return {
      layers,
      data,
      defaultProps,
      handleNodeClick
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