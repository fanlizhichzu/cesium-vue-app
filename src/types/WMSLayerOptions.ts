import { type BaseLayerOption } from './BaseLayerOptions';
export interface WMSLayerOptions extends BaseLayerOption {
    version?: string; // WMS版本
    format?: string; // 图像格式
    layers?: string[]; // 图层名称列表
    styles?: string[]; // 样式列表
    transparent?: boolean; // 是否透明
    tiled?: boolean; // 是否为瓦片服务
    dimensions?: Record<string, string>; // 维度参数
    time?: string; // 时间参数
    elevation?: string; // 高程参数
    service?: string; // 服务类型，默认为WMS
    request?: string; // 请求类型，默认为GetMap
    exceptions?: string; // 异常格式，默认为XML
    crossOrigin?: boolean | string; // 是否跨域请求
    params?: Record<string, string>; // 其他参数
    serverType?: 'geoserver' | 'mapserver' | 'qgis'
}