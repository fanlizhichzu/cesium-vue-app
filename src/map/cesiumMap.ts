import { Viewer, Ion } from "cesium";
import OLCesium from "olcs";
import { Map } from 'ol';

import 'cesium/Build/Cesium/Widgets/widgets.css';

export class CesiumMap {
    private ol3d: any;
    private viewer: Viewer | null = null;

    constructor(olMap: Map) {
        this.ol3d = new OLCesium({ map: olMap });
        this.viewer = this.ol3d.getCesiumScene();
        this.initCesium();
    }

    private async initCesium(): Promise<void> {
        // 1. 设置Cesium Ion令牌（必需）
        Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOTc4YTk0OS04Yzc0LTQ0NGItYmQ5Mi1mZDRiNTcwOTVmODEiLCJpZCI6MTc1NTUyLCJpYXQiOjE2OTg5MDU3NjF9.VPB-f81rQRFA72amiP_ja9CZvP4uSfTqLc2zRXAMPzM';

        if (!this.viewer) {
            throw new Error("Cesium viewer is not initialized.");
        }

        // 先使用最简单的配置测试
        this.viewer.terrainProvider = new window.Cesium.EllipsoidTerrainProvider();


        // 4. 设置合理的初始视角
        this.viewer.camera.flyTo({
            destination: (window as any).Cesium.Cartesian3.fromDegrees(
                -109.67567, 42.04193, 2000000
            ),
            orientation: {
                heading: 0,
                pitch: -Math.PI / 4,
                roll: 0
            }
        });
    }

    enable3D(enabled: boolean): void {
        this.ol3d.setEnabled(enabled);
    }

    add3dTiles(url: string, options: any): void {
        if (!this.viewer) {
            throw new Error("Cesium viewer is not initialized.");
        }

        this.viewer.scene.primitives.add(
            new (window as any).Cesium.Cesium3DTileset({
                url,
                ...options
            })
        );
    }

    destroy(): void {
        if (this.ol3d) {
            this.ol3d.setEnabled(false);
            this.ol3d = null;
        }
    }


}