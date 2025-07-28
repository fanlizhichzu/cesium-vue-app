// src/map/layers/olTileLayer.ts
import { type BaseLayerOption, type LayerOptions } from '../../../types/LayerTypes';
import { OLMap } from '../map/olMap';

export class OLTileLayer implements BaseLayerOption {
  private layer: any;
  
  constructor(
    private olMap: OLMap,
    private source: any,
    private options: LayerOptions
  ) {
    this.layer = olMap.addTileLayer(options);
  }

  async addToMap(): Promise<void> {
    this.olMap.addTileLayer(this.options);
  }

  removeFromMap(): void {
    this.olMap.removeLayer(this.layer);
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