// src/map/layers/olTileLayer.ts
import { type BaseLayerOption, type LayerOptions } from '../../../types/LayerTypes';
import { CesiumMap } from '../map/cesiumMap';

export class CesiumModelLayer implements BaseLayerOption {
  private layer: any;
  
  constructor(
    private cesiumMap: CesiumMap,
    private options: LayerOptions
  ) {
    this.layer = cesiumMap.add3dTiles(options);
  }

  async addToMap(): Promise<void> {
    this.cesiumMap.add3dTiles(this.options);
  }

  removeFromMap(): void {
    this.cesiumMap.removeLayer(this.layer);
  }

  setVisible(visible: boolean): void {
    this.layer.setVisible(visible);
  }

  setOpacity(opacity: number): void {
    this.layer.setOpacity(opacity);
  }

  updateOptions(options: LayerOptions): void {
    // 更新图层选项的实现
  }
}