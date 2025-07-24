<template>
    <el-tree
        :data = "props.data"
        :props = "props.defaultProps"
        :load = "props.loadData"
        :lazy = "props.lazy"
        node-key = props.nodekey
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
        },
        loadData: {
            type: Function as PropType<(node: TreeNode, resolve: (data: TreeNode[]) => void) => void>,
            default: () => {
                return (node: TreeNode, resolve: (data: TreeNode[]) => void) => {
                    // Default loadData function does nothing
                    resolve([]);
                }
            }
        },
        nodekey: {
            type: String,
            default: 'id'
        }
    });

    const emit = defineEmits({
        'node-click': (node: TreeNode) => true,
    });

    const handleNodeClick = (node: TreeNode) => {
        emit('node-click', node);
    }

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