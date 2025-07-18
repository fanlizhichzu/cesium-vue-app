<!-- components/Tree/TreeNodeContent.vue -->
<template>
    <div class="tree-node-content">
      <span :class="['node-label', { 'is-offline': data.status === 'offline' }]">
        {{ node.label }}
      </span>
      <el-tag v-if="data.type" size="small" :type="tagType">
        {{ typeText }}
      </el-tag>
      <el-icon v-if="data.icon">
        <component :is="data.icon" />
      </el-icon>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import type { TreeNode } from '@/types/treeTypes'
  
  const props = defineProps<{
    node: any
    data: TreeNode
  }>()
  
  const typeMap = {
    department: { text: '部门', type: '' },
    user: { text: '用户', type: 'success' },
    device: { text: '设备', type: 'info' }
  }
  
 // 定义 typeMap 的 key 类型
type TypeMapKey = keyof typeof typeMap

// 判断 props.data.type 是否是合法的 key
const isValidType = (type: any): type is TypeMapKey => {
  return Object.prototype.hasOwnProperty.call(typeMap, type)
}

  const tagType = computed(() => {
    return isValidType(props.data.type) ? typeMap[props.data.type].type : ''
  })
  const typeText = computed(() => {
    return isValidType(props.data.type) ? typeMap[props.data.type].text : ''
  })
  </script>
  
  <style scoped>
  .tree-node-content {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .is-offline {
    color: var(--el-text-color-secondary);
    text-decoration: line-through;
  }
  .el-icon {
    /* flex-shrink: 0; */
    margin-left: auto;
    margin-right: 8px;
  }

 .node-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px; 
  }
  </style>