import { Map as OlMap } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Stroke, Fill, Circle } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { type LayerOptions, type ILayer, LayerType } from '../types';
import { type IMapEngine } from '../IMapEngine';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View';
import { XYZ } from 'ol/source';

export class OpenLayersMapEngine implements IMapEngine {
  private map: OlMap | null = null;

  createMap(container: HTMLElement, options?: any) {
    this.map = new OlMap({
      target: container,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=0c4bf211134dd7fce45d5be020eb7de7',
            crossOrigin: "anoymous",
            wrapX: false
          })
        })
      ],
      view: new View({
        center: fromLonLat([120, 30]),
        zoom: 10,
        ...options
      })
    })
    return this.map;
  }

  createLayer(type: LayerType, data: any, options: LayerOptions) {
    if (!this.map) {
      throw new Error("Map is not initialized. Call createMap first.");
    }

    switch (type) {
      case LayerType.GeoJSON:
        return new OpenLayersGeoJsonLayer(this.map, data as GeoJSON.FeatureCollection, options);
      // 其他OpenLayers图层类型...
      default:
        throw new Error(`OpenLayers unsupported layer type: ${type}`);
    }
  }
}

class OpenLayersGeoJsonLayer implements ILayer {
  private vectorLayer: VectorLayer<VectorSource>;
  private source: VectorSource;
  private currentStyle: Style;

  constructor(
    private readonly map: OlMap,
    private data: GeoJSON.FeatureCollection,
    private options: LayerOptions
  ) {
    this.source = new VectorSource({
      features: new GeoJSON().readFeatures(data, {
        featureProjection: 'EPSG:3857', // 转换为地图投影
        dataProjection: 'EPSG:4326'    // 原始数据为WGS84
      })
    });

    this.vectorLayer = new VectorLayer({
      source: this.source,
      style: this.createStyle()
    });

    this.currentStyle = this.createStyle();
  }

  // 实现ILayer接口
  addTo(): void {
    this.map.addLayer(this.vectorLayer);
  }

  remove(): void {
    this.map.removeLayer(this.vectorLayer);
    this.source.clear();
  }

  setVisible(visible: boolean): void {
    this.vectorLayer.setVisible(visible);
  }

  updateData(data: GeoJSON.FeatureCollection): void {
    this.data = data;
    this.source.clear();
    this.source.addFeatures(
      new GeoJSON().readFeatures(data, {
        featureProjection: 'EPSG:3857',
        dataProjection: 'EPSG:4326'
      })
    );
  }

  // 私有方法：创建样式
  private createStyle(): Style {
    return new Style({
      stroke: new Stroke({
        color: this.options.style?.strokeColor || '#3388ff',
        width: this.options.style?.strokeWidth || 2
      }),
      fill: new Fill({
        color: this.options.style?.fillColor
          ? hexToRgba(this.options.style.fillColor, this.options.style.fillOpacity || 0.5)
          : 'rgba(51, 136, 255, 0.3)'
      }),
      image: new Circle({
        radius: this.options.style?.pointRadius || 5,
        fill: new Fill({
          color: this.options.style?.pointColor || '#ff0000'
        })
      })
    });
  }

  // 扩展方法：高亮要素
  highlightFeature(featureId: string): void {
    const feature = this.source.getFeatureById(featureId);
    if (feature) {
      feature.setStyle(new Style({
        stroke: new Stroke({
          color: '#ff0000',
          width: 3
        }),
        zIndex: 100
      }));
    }
  }
}

// 辅助函数：Hex转RGBA
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}