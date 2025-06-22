export interface LayerOptions {
    id: string;
    name: string;
    visible: boolean;
    value: any; 
    style?: any;
}

export interface ILayer {
    addTo(): void;
    remove() : void;
    setVisible(visible: boolean): void;
    updateData(data: any): void;
}

export type LayerData = GeoJSON.FeatureCollection | any[] | string | any;

export enum LayerType {
    GeoJSON = 'geojson',
    WMS = 'wms',
    TILESET = 'tileset',
    KML = 'kml',
    MARKER = 'marker',
    POLYGON = 'polygon',
    POLYLINE = 'polyline'
}

export enum EngineType {
    CESIUM = 'cesium',
    LEAFLET = 'leaflet'
}