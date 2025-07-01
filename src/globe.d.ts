import 'cesium';

declare global {
    interface Window {
      Cesium: typeof import('cesium');
    }
}