import { type UnifiedLayer, type UnifiedViewState , type FlightTrackOptions, type FlightTrackController} from '../types';

export interface IMapEngine {
    createMap(container: HTMLElement): Promise<void>;
    addLayer(layer: UnifiedLayer): Promise<string>;
    setView(state: UnifiedViewState): void;
    addFlightTrack(options: FlightTrackOptions): Promise<FlightTrackController>;
    destroy(): void;
  }