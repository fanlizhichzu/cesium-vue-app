// src/map/layerTypes.ts
import { type WMSLayerOptions } from './WMSLayerOptions';
import { type Cesium3DTilesLayerOptions } from './Cesium3DTilesLayerOptions';
import { type TreeNode } from '@/types/treeTypes';
import { type BaseLayerOption } from './BaseLayerOptions';


export type LayerOptions = 
  | WMSLayerOptions


export interface BaseLayer {
  addToMap(): Promise<void>;
  removeFromMap(): void;
  setVisible(visible: boolean): void;
  setOpacity(opacity: number): void;
  updateOptions(options: LayerOptions): void;
}

export function createLayerOptions(layerNode: TreeNode): LayerOptions {

  const config = layerNode.config || {};

  const baseLayerOption : BaseLayerOption = {
    id: layerNode.id.toString(),
    title: layerNode.label,
    type: layerNode.type || 'unknown',
    name: layerNode.label,
    url: config.url || '',
    visible: true,
    opacity: 1.0,
    zIndex: 0,
    projection: 'EPSG:4326',
    minZoom: 0,
    maxZoom: 18,
  }

  if (layerNode.type === 'wms') {
    
    return {
      ...baseLayerOption,
    } as WMSLayerOptions;
  }

  throw new Error(`Unsupported layer type: ${layerNode.type}`);
}

// 类型守卫函数
export function isWMSLayer(options: LayerOptions): options is WMSLayerOptions {
  return options.type === 'wms';
}

export function is3DTilesLayer(options: LayerOptions): options is Cesium3DTilesLayerOptions {
  return options.type === '3dtiles';
}
