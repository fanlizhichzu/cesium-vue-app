import { defineStore } from "pinia";
import type { TreeNode } from "@/types/treeTypes";
import { getDirectoryList, getLayerList } from "@/api/treeApi";
import { createLayerOptions } from "@/types/LayerTypes";

export const useTreeStore = defineStore("tree", {
    state: () => ({
        nodeMap: new Map<string, TreeNode>(), // 唯一数据源
        currentNode: null as TreeNode | null,
        loading: false,
    }),

    getters: {
        // 派生树数据
        treeData(state): TreeNode[] {
            const roots: TreeNode[] = [];
            state.nodeMap.forEach(node => {
                if (!node.parentId || !state.nodeMap.has(node.parentId)) {
                    roots.push(node);
                }
            });
            return roots;
        },

        // 派生目录节点
        directoryNodes(state): TreeNode[] {
            return Array.from(state.nodeMap.values()).filter(
                node => node.type === 'directory' // 根据实际类型字段调整
            );
        },

        // 派生图层节点
        layerNodes(state): TreeNode[] {
            return Array.from(state.nodeMap.values()).filter(
                node => node.type === 'layer' // 根据实际类型字段调整
            );
        },

        // 派生图层配置
        layers(state): ReturnType<typeof createLayerOptions> {
            console.log("Creating layer options from nodes:", Array.from(state.nodeMap.values()).filter(node => node.type === 'layer'));
            return createLayerOptions(
                Array.from(state.nodeMap.values()).filter(
                    node => node.type === 'layer'
                )
            );
        },

        // 获取所有节点（扁平化）
        allNodes(state): TreeNode[] {
            return Array.from(state.nodeMap.values());
        }
    },

    actions: {
        // 设置当前节点
        setCurrentNode(node: TreeNode | null) {
            this.currentNode = node;
        },

        // 加载初始数据
        async loadData() {
            this.loading = true;
            try {
                const [directories, layers] = await Promise.all([
                    getDirectoryList(),
                    getLayerList()
                ]);

                // 初始化节点映射
                this.initializeNodeMap([...directories, ...layers]);
            } catch (error) {
                console.error("Error loading data:", error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // 初始化节点映射
        initializeNodeMap(nodes: TreeNode[]) {
            this.nodeMap.clear();

            // 第一遍：添加所有节点
            nodes.forEach(node => {
                const normalizedNode: TreeNode = {
                    ...node,
                    id: String(node.id),
                    parentId: node.parentId ? String(node.parentId) : undefined,
                    children: [] // 初始化为空，后面会建立关系
                };
                this.nodeMap.set(normalizedNode.id, normalizedNode);
            });

            // 第二遍：建立父子关系
            this.nodeMap.forEach(node => {
                if (node.parentId && this.nodeMap.has(node.parentId)) {
                    const parent = this.nodeMap.get(node.parentId)!;
                    // 确保父节点存在
                    if (!parent.children) {
                        parent.children = [];
                    }
                    parent.children.push(node);
                }
            });
        },

        // 获取节点
        getNodeById(id: string): TreeNode | undefined {
            return this.nodeMap.get(String(id));
        },

        // 更新节点
        updateNode(nodeId: string, updates: Partial<TreeNode>) {
            const id = String(nodeId);
            const node = this.nodeMap.get(id);

            if (!node) {
                console.warn(`Node with ID ${id} not found.`);
                return;
            }

            // 处理 parentId 变更
            if ('parentId' in updates) {
                const newParentId = updates.parentId ? String(updates.parentId) : undefined;

                // 从原父节点移除
                if (node.parentId) {
                    const oldParent = this.nodeMap.get(node.parentId);
                    if (oldParent && oldParent.children) {
                        oldParent.children = oldParent.children.filter(
                            child => child.id !== id
                        );
                    }
                }

                // 更新 parentId
                node.parentId = newParentId;

                // 添加到新父节点
                if (newParentId) {
                    const newParent = this.nodeMap.get(newParentId);
                    if (newParent) {
                        if (!newParent.children) {
                            newParent.children = [];
                        }
                        newParent.children.push(node);
                    }
                }
            }

            // 更新其他属性
            Object.keys(updates).forEach(key => {
                if (key !== 'parentId' && key !== 'id') {
                    // 确保只更新存在的属性
                    // @ts-ignore
                    node[key] = updates[key];
                }
            });
        },

        // 添加新节点
        addNode(newNode: TreeNode) {
            const normalizedNode: TreeNode = {
                ...newNode,
                id: String(newNode.id),
                parentId: newNode.parentId ? String(newNode.parentId) : undefined,
                children: []
            };

            this.nodeMap.set(normalizedNode.id, normalizedNode);

            // 建立父子关系
            if (normalizedNode.parentId) {
                const parent = this.nodeMap.get(normalizedNode.parentId);
                if (parent) {
                    if (!parent.children) {
                        parent.children = [];
                    }
                    parent.children.push(normalizedNode);
                }
            }
        },

        // 删除节点
        removeNode(nodeId: string) {
            const id = String(nodeId);
            const node = this.nodeMap.get(id);

            if (!node) return false;

            // 递归删除所有子节点
            const removeChildren = (nodes: TreeNode[]) => {
                nodes.forEach(child => {
                    this.nodeMap.delete(child.id);
                    if (child.children) {
                        removeChildren(child.children);
                    }
                });
            };

            if (node.children) {
                removeChildren(node.children);
            }

            // 从父节点移除
            if (node.parentId) {
                const parent = this.nodeMap.get(node.parentId);
                if (parent && parent.children) {
                    parent.children = parent.children.filter(
                        child => child.id !== id
                    );
                }
            }

            // 从映射中移除
            this.nodeMap.delete(id);
            return true;
        },

        // 查找节点路径
        findNodePath(nodeId: string): TreeNode[] {
            const path: TreeNode[] = [];
            let currentId: string | undefined = String(nodeId);

            while (currentId) {
                const node = this.nodeMap.get(currentId);
                if (!node) break;

                path.unshift(node);
                currentId = node.parentId ? String(node.parentId) : undefined;
            }

            return path;
        }
    }
});