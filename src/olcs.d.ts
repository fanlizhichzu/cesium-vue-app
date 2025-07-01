declare module 'olcs' {
    import { Map } from 'ol';
    import { Viewer } from 'cesium';
  
    class OLCesium {
      constructor(options: {
        map: Map;
        cesiumViewer: Viewer;
        timeFunction?: () => any;
      });
      enableAutoRenderLoop(): void;
      enableViewSync(config: {
        projection?: 'auto' | 'none';
        view?: 'both' | 'ol-to-cesium' | 'cesium-to-ol';
        zoom?: 'cesium-led' | 'ol-led';
      }): void;
      dispose(): void;
    }
  
    export default OLCesium;
  }