import { defineProps, defineEmits, type PropType } from "vue";
import type { TreeNode } from "@/types/treeTypes";
import { useTreeStore } from "@/stores/treeStore";

export function useTree() {

    const treeStore = useTreeStore();

    const loadData = async (node: TreeNode, resolve: (data: TreeNode[]) => void) => {
    
        try {
            await treeStore.loadTreeData();
            resolve(treeStore.treeData);
        } catch (error) {
            console.error('Error loading node children:', error);
            resolve([]);
        }
    }

    const loadTreeData = async () => {
        try {
            await treeStore.loadTreeData();
        } catch (error) {
            console.error('Error loading tree data:', error);
        }
    }

    const getCurrentNode = () => treeStore.getCurrentNode();
    
    const setCurrentNode = (node: TreeNode | null) => treeStore.setCurrentNode(node);

    return {
        treeStore,
        loadData,
        getCurrentNode,
        setCurrentNode,
        loadTreeData
    };

}
