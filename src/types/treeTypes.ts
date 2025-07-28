export interface TreeNode {
    id: string | number;
    label: string;
    children?: TreeNode[];
    icon?: string;
    disabled?: boolean;
    isLeaf?: boolean;
    type?: 'department' | 'user' | 'device' | 'wms' | '3dtiles';
    status?: 'online' | 'offline';
    level?: number; 
    parentId?: string | number; // 用于标识父节点
    config? : any;
}

// 示例数据
export const mockTreeData: TreeNode[] = [
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
  ]

