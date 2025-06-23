import { EngineType, LayerType, type LayerOptions, type LayerData, type ILayer } from "./types";
import * as Cesium from "cesium";
import L from "leaflet";

export interface IMapEngine<TMap = any> {
    createMap(container: HTMLElement, options?: any): any;
    createLayer(type: LayerType, data: LayerData, options: LayerOptions): TMap;
}

export class MapEngineFactory {
    static getEngine(type: EngineType): IMapEngine {
        console.log(`Creating map engine for type: ${type}`);
        switch (type) {
            case EngineType.CESIUM:
                return new CesiumMapEngine();
            case EngineType.LEAFLET:
                return new LeafletMapEngine();
            default:
                throw new Error(`Unsupported engine type: ${type}`);
        }
    }
}

class CesiumMapEngine implements IMapEngine {
    private _viewer: Cesium.Viewer | null = null;
    private _readyPromise: Promise<void> | null = null;

    async createMap(container: HTMLElement, options?: any) {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOTc4YTk0OS04Yzc0LTQ0NGItYmQ5Mi1mZDRiNTcwOTVmODEiLCJpZCI6MTc1NTUyLCJpYXQiOjE2OTg5MDU3NjF9.VPB-f81rQRFA72amiP_ja9CZvP4uSfTqLc2zRXAMPzM';
        this._readyPromise = (async ()=>{
            const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(
                1,
                {
                    requestVertexNormals: true,
                }
            );
            this._viewer = new Cesium.Viewer(container, {
                terrainProvider: terrainProvider,
                infoBox: false,
                ...options
            });
            
        })();
        return this._readyPromise?.then(() => this._viewer!);
    }
    
    async createLayer(type: LayerType, data: LayerData, options: LayerOptions): Promise<ILayer> {
        if (!this._readyPromise) throw new Error("Call createMap first");
        await this._readyPromise;
        if (!this._viewer) {
            throw new Error("Viewer is not initialized. Call createMap first.");
        }
        switch (type) {
            case LayerType.GeoJSON:
                console.log("Creating Cesium GeoJSON Layer");
                return new CesiumGeoJsonLayer(this._viewer, data as GeoJSON.FeatureCollection, options);
            // 其他Cesium图层类型...
            default:
                throw new Error(`Cesium unsupported layer type: ${type}`);
        }
    }

 


}

class LeafletMapEngine implements IMapEngine {
    private map: L.Map | null = null;
    
    createMap(container: HTMLElement, options?: any) {
        this.map = L.map(container, {
            // center: [45, 48],
            zoom: 18,
            // ...options
        });

        L.tileLayer('http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=0c4bf211134dd7fce45d5be020eb7de7', {
            tileSize: 256,
            zoomOffset: 0,
            maxZoom: 18
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

class CesiumGeoJsonLayer implements ILayer {
    private dataSource: Cesium.GeoJsonDataSource | null = null;

    constructor(private readonly viewer: Cesium.Viewer, private data: GeoJSON.FeatureCollection, private options: LayerOptions) {}

    async addTo() {
        console.log("Adding Cesium GeoJSON Layer");
        this.dataSource = await Cesium.GeoJsonDataSource.load(this.data, {
            stroke: Cesium.Color.HOTPINK,
            fill: Cesium.Color.PINK.withAlpha(0.5),
            strokeWidth: 3,
            ...this.options
        });
        this.viewer.dataSources.add(this.dataSource);
    }

    remove(): void {
        if (this.dataSource && this.dataSource.entities) {
            this.dataSource.entities.removeAll();
        }
    }

    setVisible(visible: boolean): void {
        if (this.dataSource) {
            this.dataSource.show = visible;
        }
    }

    updateData(data: any): void {
        this.data = data;
        this.remove()
        this.addTo();
    }
}

class LeafletGeoJsonLayer implements ILayer {
    private layer: L.GeoJSON | null = null;

    constructor(private readonly map: L.Map, private data: GeoJSON.FeatureCollection, private options: LayerOptions) {}

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


