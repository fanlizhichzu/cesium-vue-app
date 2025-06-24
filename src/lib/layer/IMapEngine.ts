import { type LayerOptions, type ILayer , type LayerType, type LayerData} from './types';

export interface IMapEngine<TMap = any> {
    createMap(container: HTMLElement, options?: any): any;
    createLayer(type: LayerType, data: LayerData, options: LayerOptions): TMap;
}