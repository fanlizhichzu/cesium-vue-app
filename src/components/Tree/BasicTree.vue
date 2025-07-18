<template>
    <el-tree
        :data = "props.data"
        :props = "props.defaultProps"
        :load = "loadData"
        :lazy = "props.lazy"
        node-key="id"
        highlight-current
        show-checkbox
        @node-click = "handleNodeClick"
    >
    <template #default="{ node, data }">
      <TreeNodeContent :node="node" :data="data" />
    </template>
    </el-tree>
</template>

<script lang="ts" setup>

import {useTree} from '@/composables/useTree';

import {type PropType } from "vue";
import {type TreeNode} from '@/types/treeTypes';
import TreeNodeContent from './TreeNodeContent.vue';



const props = defineProps({
        data: {
            type: Array as PropType<TreeNode[]>,
            required: true
        },
        lazy: { type: Boolean, default: false },
        defaultProps: {
            type: Object,
            default: () => {
                return {
                    children: 'children',
                    label: 'label',
                    isLeaf: 'isLeaf'
                }
            }
        }
    });

    const emit = defineEmits({
        'node-click': (node: TreeNode) => true,
    })

const {loadData, getCurrentNode, setCurrentNode, handleNodeClick} = useTree(props, emit);

defineExpose({
    getCurrentNode,
    setCurrentNode
});
</script>

<style scoped>
.el-tree {
    width: 300px;
    z-index: 1000;
    position: fixed;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip
}

</style>