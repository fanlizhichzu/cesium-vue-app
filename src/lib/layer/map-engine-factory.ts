import { EngineType, LayerType, type LayerOptions, type LayerData, type ILayer } from "./types";
import * as Cesium from "cesium";
import L, { map } from "leaflet";

export interface IMapEngine<TMap = any> {
    createLayer(type: LayerType, data: LayerData, options: LayerOptions): TMap;
    createMap(container: HTMLElement, options?: any): any;
}

export class MapEngineFactory {
    static getEngine(type: EngineType): IMapEngine {
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
    private viewer: Cesium.Viewer | null = null;

    async createMap(container: HTMLElement, options?: any) {
        const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(
            1,
            {
                requestVertexNormals: true,
            }
        );
        this.viewer = new Cesium.Viewer(container, {
            terrainProvider: terrainProvider,
            ...options
        });
        return this.viewer;
    }
    
    createLayer(type: LayerType, data: LayerData, options: LayerOptions): ILayer {
        if (!this.viewer) {
            throw new Error("Viewer is not initialized. Call createMap first.");
        }
        switch (type) {
            case LayerType.GeoJSON:
                console.log("Creating Cesium GeoJSON Layer");
                return new CesiumGeoJsonLayer(this.viewer, data as GeoJSON.FeatureCollection, options);
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
            center: [0, 0],
            zoom: 2,
            ...options
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 2,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

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
    private mapInstance: Cesium.Viewer | null = null;

    constructor(private readonly viewer: Cesium.Viewer, private data: GeoJSON.FeatureCollection, private options: LayerOptions) {}

    async addTo() {
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


