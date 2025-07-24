import type { TreeNode } from '@/types/treeTypes';
import request from '@/utils/request';

export const getList = async (): Promise<TreeNode[]> => {
    const data = await request.get('/mapLayerDirectory/list');
    console.log('getList:', data);

    const treeNodes: TreeNode[] = data.map((item: any) => ({
        id: item.id,
        label: item.directoryTitle,
        type: "department", 
        children: item.children || [],
        isLeaf: item.isLeaf ?? false,
        level: item.level ?? 0,
    }));

    return treeNodes;

}

export const fetchTreeData = async (): Promise<TreeNode[]> => {
    // 模拟异步数据获取
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    label: '一级 1',
                    type: 'department',
                    children: [
                        {
                            id: 4,
                            label: '二级 1-1',
                            type: 'department',
                            children: [
                                { id: 9, label: '三级 1-1-1', type: 'user', status: 'online' },
                                { id: 10, label: '三级 1-1-2', type: 'user', status: 'offline' }
                            ]
                        }
                    ]
                }
            ]);
        }, 1000);
    });
}

export const liadChildrenTreeData = async (): Promise<TreeNode[]> => {
    // 模拟异步数据获取
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    label: '一级 1',
                    type: 'department',
                    children: [
                        {
                            id: 4,
                            label: '二级 1-1',
                            type: 'department',
                            children: [
                                { id: 9, label: '三级 1-1-1', type: 'user', status: 'online' },
                                { id: 10, label: '三级 1-1-2', type: 'user', status: 'offline' }
                            ]
                        }
                    ]
                }
            ]);
        }, 1000);
    });
}