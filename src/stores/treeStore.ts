import { defineStore } from "pinia";
import type { TreeNode } from "@/types/treeTypes";
import {fetchTreeData, getList} from "@/api/treeApi";

export const useTreeStore = defineStore("tree", {
    state: () => ({
        treeData: [] as TreeNode[],
        currentNode: null as TreeNode | null,
        loading: false,
    }),
    actions: {
        async loadTreeData() {
            this.loading = true;
            try {
                console.log('Loading tree data...');
                this.treeData = await getList();
            } finally {
                this.loading = false;
            }
        },

        async liadChildrenTreeData() {
            if (this.currentNode) {
                this.loading = true;
                try {
                    const children = await fetchTreeData();
                    this.currentNode.children = children;
                } finally {
                    this.loading = false;
                }
            }
        },
        
        setCurrentNode(node: TreeNode | null) {
            this.currentNode = node;
        },

        getCurrentNode(): TreeNode | null {
            return this.currentNode;
        }
    }
})