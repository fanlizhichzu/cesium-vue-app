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

export function createLayerOptions(layerNodes: TreeNode[]): LayerOptions[] {
  const layerOptions: LayerOptions[] = [];
  
  layerNodes.forEach(node => {
    const layerOption = createLayerOption(node);
    if (layerOption) {
      layerOptions.push(layerOption);
    }
    
  })

  return layerOptions;
}

export function createLayerOption(layerNode: TreeNode): LayerOptions | undefined {

  console.log('Creating layer option for node:', layerNode);
  const config = layerNode.config ? JSON.parse(layerNode.config) : {};

  const baseLayerOption : BaseLayerOption = {
    id: layerNode.id.toString(),
    type: config.type || 'unknown',
    title: layerNode.label,

    name: layerNode.label,
    url: config.url || '',
    visible: true,
    opacity: 1.0,
    zIndex: 0,
    // projection: 'EPSG:4326',
    // minZoom: 0,
    // maxZoom: 18,
  }

  if (baseLayerOption.type === 'wms') {
    return {
      ...baseLayerOption,
    } as WMSLayerOptions;
  }

}

// 类型守卫函数
export function isWMSLayer(options: LayerOptions): options is WMSLayerOptions {
  return options.type === 'wms';
}

export function is3DTilesLayer(options: LayerOptions): options is Cesium3DTilesLayerOptions {
  return options.type === '3dtiles';
}
