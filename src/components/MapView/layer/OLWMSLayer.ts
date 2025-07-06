// src/map/layers/olTileLayer.ts
import { type BaseLayer, type LayerOptions } from '../../../types/LayerTypes';
import { OLMap } from '../map/olMap';

export class OLWMSLayer implements BaseLayer {
  private layer: any;
  
  constructor(
    private olMap: OLMap,
    private options: LayerOptions
  ) {
    this.layer = olMap.addWMSLayer(options);
  }

  async addToMap(): Promise<void> {
    this.olMap.addWMSLayer(this.options);
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