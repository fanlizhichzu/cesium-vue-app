import { type LayerOptions, type ILayer , type LayerType, type LayerData} from '../types';

export interface IMapEngine<TMap = any> {
    createMap(container: HTMLElement, options?: any): any;
    createLayer(type: LayerType, data: LayerData, options: LayerOptions): TMap;
    addFlightTrack(options: {
        data: Array<{longitude: number; latitude: number; height: number}>;
        startTime?: String;
        timeStep?: number;
        modelUri?: string;
    }): Promise<{
        track: () => void;
        remove: () => void;
    }>
}