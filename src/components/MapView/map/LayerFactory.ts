// src/map/layerFactory.ts
import { type BaseLayer, type LayerOptions, isWMSLayer, is3DTilesLayer} from '../../../types/LayerTypes';
import { OLMap } from './olMap';
import { CesiumMap } from './cesiumMap';
import { OLTileLayer } from '../layer/OLTileLayer';
import { OLImageLayer } from '../layer/OLImageLayer';
import { OLWMSLayer } from '../layer/OLWMSLayer';
import { Cesium3DTilesLayer } from '../layer/Cesium3DTilesLayer';
import { CesiumModelLayer } from '../layer/CesiumModelLayer';

export interface LayerFactory {
  createLayer(options: LayerOptions): void;
}

export class OLMapLayerFactory implements LayerFactory {
  constructor(private olMap: OLMap) {}

  createLayer(options: LayerOptions): BaseLayer | undefined {
      if (isWMSLayer(options)) {
        return new OLWMSLayer(this.olMap, options);
      }
  }
}

export class CesiumLayerFactory implements LayerFactory {
  constructor(private cesiumMap: CesiumMap) {}

  createLayer(options: LayerOptions): BaseLayer | undefined {
    if (is3DTilesLayer(options)) {
      return new Cesium3DTilesLayer(this.cesiumMap, options);
    }
  }
}