import { OLMap } from '@/map/olMap';
import { CesiumMap } from '@/map/cesiumMap';

export class MapManager {
    private olMap: OLMap | null = null;
    private cesiumMap: CesiumMap | null = null;

    constructor(target: string) {
        console.log('Initializing MapManager with target:', target);
        this.olMap = new OLMap(target);
    }

    async initCesiumMap(): Promise<void> {
        if (!this.olMap) {
            throw new Error("OpenLayers map is not initialized.");
        }
        window.Cesium = await import('cesium');
        this.cesiumMap = new CesiumMap(this.olMap.getMapInstance());
        console.log('Cesium map initialized', this.cesiumMap);
    }

    toggle3DView(): void {
        console.log('olMap', this.olMap);
        console.log('cesiumMap', this.cesiumMap);
        if (!this.olMap || !this.cesiumMap) {
            throw new Error("Maps are not initialized.");
        }
        this.cesiumMap.enable3D();
    }

    add2DLayer(type: 'tile' | 'image', source: any, options: any): void {
        if (type === 'tile') {
            this.olMap?.addTileLayer(source, options);
        } else if (type === 'image') {
            this.olMap?.addImageLayer(source, options);
        } else {
            throw new Error('type not supported')
        }
    }

    add3DLayer(url: string, options: any): void {
        if (!this.cesiumMap) {
            throw new Error("Cesium map is not initialized.");
        }
        this.cesiumMap.add3dTiles(url, options);
    }

    destroy(): void {
        if (this.olMap) {
            this.olMap.destroy();
            this.olMap = null;
        }
        if (this.cesiumMap) {
            this.cesiumMap.destroy();
            this.cesiumMap = null;
        }
    }
}
