export interface UnifiedLayer {
    id: string;
    type: 'vector' | 'raster' | '3dtiles';
    source: string | GeoJSON.FeatureCollection | any;
    style?: layerStyle;
    syncMode?: 'auto' | '2d' | '3d';
}

export interface layerStyle {
    color?: string;
    opacity?: number;
    strokeColor?: string;
    strokeWidth?: number;
    fillColor?: string;
    fillOpacity?: number;
    radius?: number; // For point layers
    lineDash?: number[]; // For line layers
}

export interface UnifiedViewState {
    center: [number, number];
    zoom: number;
    height?: number; // 3D特有
    rotation?: number;
}

// 飞行轨迹配置
export interface FlightTrackOptions {
    path: Array<{lon: number, lat: number, height?: number}>;
    modelUrl?: string;
    speed?: number;
  }
  
  // 轨迹控制器
export interface FlightTrackController {
    play(): void;
    pause(): void;
    remove(): void;
}