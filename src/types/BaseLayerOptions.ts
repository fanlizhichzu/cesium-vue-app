export interface BaseLayer {
    /**
     * 主键
     */
    id: string;
    /**
     * 图层类型
     */
    type: string
    /**
     * 图层名称
     */
    name: string;
    /**
     * 图层标题
     */
    title: string;
    /**
     * 图层地址
     */
    url?: string;
    /**
     * 可见图层
     */
    visible?: boolean;
    /**
     * 透明度 (0-1)
     */
    opacity?: number;
    /**
     * 图层的z-index
     */
    zIndex?: number;
    /**
     * 投影坐标系
     */
    projection?: string;
    /**
     * 最小缩放级别
     */
    minZoom?: number;
    /**
     * 最大缩放级别
     */
    maxZoom?: number;
}