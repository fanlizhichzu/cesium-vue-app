import { LayerType, type LayerOptions, type LayerData, type ILayer } from "../types";
import * as Cesium from "cesium";
import { type IMapEngine } from '../IMapEngine';

export class CesiumMapEngine implements IMapEngine {
    private _viewer: Cesium.Viewer | null = null;
    private _readyPromise: Promise<void> | null = null;

    async createMap(container: HTMLElement, options?: any) {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOTc4YTk0OS04Yzc0LTQ0NGItYmQ5Mi1mZDRiNTcwOTVmODEiLCJpZCI6MTc1NTUyLCJpYXQiOjE2OTg5MDU3NjF9.VPB-f81rQRFA72amiP_ja9CZvP4uSfTqLc2zRXAMPzM';
        this._readyPromise = (async () => {
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

class CesiumGeoJsonLayer implements ILayer {
    private dataSource: Cesium.GeoJsonDataSource | null = null;

    constructor(private readonly viewer: Cesium.Viewer, private data: GeoJSON.FeatureCollection, private options: LayerOptions) { }

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