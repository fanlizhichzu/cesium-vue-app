import { defineProps, defineEmits, type PropType } from "vue";
import type { TreeNode } from "@/types/treeTypes";
import { useTreeStore } from "@/stores/treeStore";

export function useTree(
    props: {
        data: TreeNode[];
        lazy: boolean;
        defaultProps: Record<string, any>;
      },
      emit: any
) {

    const treeStore = useTreeStore();

    const handleNodeClick = (node: TreeNode) => {
        emit('node-click', node);
    }

    const loadData = async (node: TreeNode, resolve: (data: TreeNode[]) => void) => {
        if (node.level ===0){
            resolve(props.data);
            return;
        }
    
        try {
            await treeStore.loadTreeData();
            resolve(treeStore.treeData);
        } catch (error) {
            console.error('Error loading node children:', error);
            resolve([]);
        }
    }

    const getCurrentNode = () => treeStore.getCurrentNode();
    
    const setCurrentNode = (node: TreeNode | null) => treeStore.setCurrentNode(node);

    return {
        emit,
        treeStore,
        handleNodeClick,
        loadData,
        getCurrentNode,
        setCurrentNode
    };

}
