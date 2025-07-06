// src/map/layerTypes.ts
import { type WMSLayerOptions } from './WMSLayerOptions';
import { type Cesium3DTilesLayerOptions } from './Cesium3DTilesLayerOptions';


export type LayerOptions = 
  | WMSLayerOptions


export interface BaseLayer {
  addToMap(): Promise<void>;
  removeFromMap(): void;
  setVisible(visible: boolean): void;
  setOpacity(opacity: number): void;
  updateOptions(options: LayerOptions): void;
}

// 类型守卫函数
export function isWMSLayer(options: LayerOptions): options is WMSLayerOptions {
  return options.type === 'wms';
}

export function is3DTilesLayer(options: LayerOptions): options is Cesium3DTilesLayerOptions {
  return options.type === '3dtiles';
}
