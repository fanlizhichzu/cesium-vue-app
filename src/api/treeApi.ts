import type { TreeNode } from '@/types/treeTypes';
import request from '@/utils/request';

export const getDirectoryList = async (): Promise<TreeNode[]> => {
    const data = await request.get('/mapLayerDirectory/list');
    console.log('getList:', data);

    const treeNodes: TreeNode[] = data.map((item: any) => ({
        id: item.id,
        label: item.directoryTitle,
        parentId: item.directoryParent,
        type: "directory", 
        children: item.children || [],
        isLeaf: item.isLeaf ?? false,
        level: item.level ?? 0,
    }));

    return treeNodes;
}

export const getLayerList = async (): Promise<TreeNode[]> => {
    const data = await request.get('/mapLayer/list');
    console.log('getList:', data);

    const treeNodes: TreeNode[] = data.map((item: any) => ({
        id: item.id,
        label: item.layerTitle,
        parentId: item.layerParent,
        type: "layer",
        children: item.children || [],
        isLeaf: item.isLeaf ?? false,
        level: item.level ?? 0,
        config: item.layerConfig || {}, // 假设config是一个对象
    }));

    return treeNodes;
}
