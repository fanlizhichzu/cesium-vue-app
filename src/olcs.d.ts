declare module 'olcs' {
    import { Map } from 'ol';
    import { Viewer } from 'cesium';
  
    class OLCesium {
      constructor(options: {
        map: Map;
        time?: () => any;
      });
      dispose(): void;
      getCesiumScene(): any;
      setEnabled(enabled?: boolean): void;
      getEnabled(): boolean;
    }
  
    export default OLCesium;
  }