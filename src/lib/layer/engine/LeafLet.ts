import { type LayerOptions, type ILayer, LayerType, type LayerData} from '../types';
import { type IMapEngine } from '../IMapEngine';
import L from "leaflet";

export class LeafletMapEngine implements IMapEngine {
    private map: L.Map | null = null;

    createMap(container: HTMLElement, options?: any) {
        this.map = L.map(container, {
            center: [120, 30],
            zoom: 5,
            // ...options
        });

        L.tileLayer('http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=0c4bf211134dd7fce45d5be020eb7de7', {
            tileSize: 256,
            zoomOffset: 0,
            maxZoom: 8
            // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        this.map.setView([27.629216, 111.711649])

        return this.map;
    }

    createLayer(type: LayerType, data: LayerData, options: LayerOptions): ILayer {
        if (!this.map) {
            throw new Error("Map is not initialized. Call createMap first.");
        }

        switch (type) {
            case LayerType.GeoJSON:
                return new LeafletGeoJsonLayer(this.map, data as GeoJSON.FeatureCollection, options);
            // 其他Leaflet图层类型...
            default:
                throw new Error(`Leaflet unsupported layer type: ${type}`);
        }
    }
}



class LeafletGeoJsonLayer implements ILayer {
    private layer: L.GeoJSON | null = null;

    constructor(private readonly map: L.Map, private data: GeoJSON.FeatureCollection, private options: LayerOptions) { }

    addTo(): void {
        this.layer = L.geoJSON(this.data, {
            color: '#ff69b4',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.5,
            ...this.options.style,
        }).addTo(this.map);
    }

    remove(): void {
        if (this.layer) {
            this.layer.remove()
        }
    }

    updateData(data: any): void {
        this.data = data;
        this.remove();
        this.addTo();
    }

    setVisible(visible: boolean): void {
        if (this.layer) {
            if (visible) {
                this.layer.addTo(this.map);
            } else {
                this.layer.remove();
            }
        }
    }

}