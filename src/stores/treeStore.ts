import { defineStore } from "pinia";
import type { TreeNode } from "@/types/treeTypes";
import {getDirectoryList, getLayerList} from "@/api/treeApi";

export const useTreeStore = defineStore("tree", {
    state: () => ({
        directoryData: [] as TreeNode[],
        LayerData: [] as TreeNode[],
        treeData: [] as TreeNode[],
        nodeMap: new Map<string, TreeNode>(),
        currentNode: null as TreeNode | null,
        loading: false,
    }),
    actions: {
        async loadTreeData() {
            this.loading = true;
            try {
                console.log('Loading tree data...');
                this.treeData = await getDirectoryList();
            } finally {
                this.loading = false;
            }
        },
        
        setCurrentNode(node: TreeNode | null) {
            this.currentNode = node;
        },

        getCurrentNode(): TreeNode | null {
            return this.currentNode;
        },

        async buildTree() {
            this.directoryData = await getDirectoryList();
            this.LayerData = await getLayerList();

            const allNodes = [...this.directoryData, ...this.LayerData];
            const map = new Map<string, TreeNode>();
            const result: TreeNode[] = [];
            
            // 先缓存所有节点到map
            allNodes.forEach(node => {
                map.set(String(node.id), {...node, children: node.children || []});
            })
            console.log('Cached nodes:', map);

            // 再次遍历，根据parentId挂载子节点
            map.forEach((node, id) => {
                const parentId = String(node.parentId);
                if (parentId && map.has(parentId)) {
                    console.log(`Node ${node.label} with ID ${id} has parent ID ${parentId}`);
                    const parent = map.get(parentId);
                    if (parent) {
                        parent.children!.push(node);
                    }
                } else {
                    result.push(node); // 根节点
                }
            })

            // 更新缓存
            this.nodeMap = map;
            this.treeData = result;
        }
    }
})