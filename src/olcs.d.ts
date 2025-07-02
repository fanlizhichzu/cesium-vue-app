declare module 'olcs' {
    import { Map } from 'ol';
    import { Viewer } from 'cesium';
  
    class OLCesium {
      constructor(options: {
        map: Map;
        timeFunction?: () => any;
      });
      dispose(): void;
    }
  
    export default OLCesium;
  }