import { EngineType, LayerType, type LayerOptions, type LayerData } from "./types";
import { OpenLayersMapEngine } from "./engine/OpenLayersEngine";
import { CesiumMapEngine } from "./engine/CesiumEngine";
import { LeafletMapEngine } from "./engine/LeafLet";

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
            case EngineType.OPENLAYERS:
                return new OpenLayersMapEngine();
            default:
                throw new Error(`Unsupported engine type: ${type}`);
        }
    }
}

