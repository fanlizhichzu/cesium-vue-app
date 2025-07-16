import { defineStore } from "pinia";
import type { TreeNode } from "@/types/treeTypes";
import {fetchTreeData} from "@/api/treeApi";

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
                this.treeData = await fetchTreeData();
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