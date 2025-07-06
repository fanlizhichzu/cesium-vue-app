import * as Cesium from 'cesium';
import OLCesium from "olcs";
import { Map } from 'ol';

import 'cesium/Build/Cesium/Widgets/widgets.css';

export class CesiumMap {
    private ol3d: OLCesium;
    private viewer: any;

    constructor(olMap: Map) {
        window.Cesium = Cesium;
        this.ol3d = new OLCesium({
            map: olMap,
            time() {
              return Cesium.JulianDate.now();
            },
          });
        this.viewer = this.ol3d.getCesiumScene();
        this.ol3d.setEnabled(true);
        console.log(this.ol3d.getEnabled());
    }

    private async initialize(olMap: Map) {
        
    }

    setEnabled() {
        this.ol3d.setEnabled();
    }

    enable3D(): void {
        this.ol3d.setEnabled(!this.ol3d.getEnabled());
        console.log(this.ol3d.getEnabled());
    }

    add3dTiles(options: any): void {
        if (!this.viewer) {
            throw new Error("Cesium viewer is not initialized.");
        }

        this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                ...options
            })
        );
    }

    destroy(): void {
        if (this.ol3d) {
            this.ol3d.setEnabled(false);
        }
    }

    removeLayer(layer: any): void {}
    


}