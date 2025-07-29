export interface TreeNode {
    id: string;
    label: string;
    children?: TreeNode[];
    icon?: string;
    disabled?: boolean;
    isLeaf?: boolean;
    type?: 'directory' | 'layer';
    status?: 'online' | 'offline';
    level?: number; 
    parentId?: string | null; // 用于标识父节点
    config? : any;
}


