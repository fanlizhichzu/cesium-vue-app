import type { TreeNode } from "@/types/treeTypes";
import { useTreeStore } from "@/stores/treeStore";

export function useTree() {

    const treeStore = useTreeStore();

    const loadTreeData = async () => {
        try {
            await treeStore.loadData();
        } catch (error) {
            console.error('Error loading tree data:', error);
        }
    }

    
    const setCurrentNode = (node: TreeNode | null) => treeStore.setCurrentNode(node);

    return {
        treeStore,
        setCurrentNode,
        loadTreeData
    };

}
