import { OLMap } from '@/components/MapView/map/olMap';
import { CesiumMap } from '@/components/MapView/map/cesiumMap';
import { OLMapLayerFactory, CesiumLayerFactory } from './LayerFactory';
import { type BaseLayer } from '@/types/LayerTypes';
import { type LayerOptions } from '@/types/LayerTypes';

export class MapManager {
    private olMap: OLMap | null = null;
    private cesiumMap: CesiumMap | null = null;
    private olLayerFactory: OLMapLayerFactory | null = null;
    private cesiumLayerFactory: CesiumLayerFactory | null = null;
    private layers: Map<string, BaseLayer> = new Map();

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
        this.olLayerFactory = new OLMapLayerFactory(this.olMap);
        this.cesiumLayerFactory = new CesiumLayerFactory(this.cesiumMap);
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

     async addLayer(options: LayerOptions): Promise<void> {
        if (!options.id) {
            throw new Error("Layer ID is required");
        }

        if (this.layers.has(options.id)) {
            console.warn(`Layer with ID ${options.id} already exists`);
            return;
        }

        let layer: BaseLayer | undefined;
        
        if (options.type === '3d-tiles' || options.type === '3d-model') {
            if (!this.cesiumLayerFactory) {
                throw new Error("Cesium map is not initialized.");
            }
            layer = this.cesiumLayerFactory.createLayer(options);
        } else {
            if (!this.olLayerFactory) {
                throw new Error("OpenLayers map is not initialized.");
            }
            layer = this.olLayerFactory.createLayer(options);
        }

        if (!layer) {
            throw new Error(`Unsupported layer type: ${options.type}`);
        }

        await layer.addToMap();
        this.layers.set(options.id, layer);
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
