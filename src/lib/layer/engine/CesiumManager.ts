import { Viewer, Ion, CesiumTerrainProvider } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

export class CesiumManager {
  private static ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOTc4YTk0OS04Yzc0LTQ0NGItYmQ5Mi1mZDRiNTcwOTVmODEiLCJpZCI6MTc1NTUyLCJpYXQiOjE2OTg5MDU3NjF9.VPB-f81rQRFA72amiP_ja9CZvP4uSfTqLc2zRXAMPzM'; // 您的令牌
  private _viewer: Viewer | null = null;
  private _readyPromise: Promise<void>;

  constructor(container: HTMLElement) {
    Ion.defaultAccessToken = CesiumManager.ION_TOKEN;
    
    this._readyPromise = this._initialize(container);
  }

  private async _initialize(container: HTMLElement): Promise<void> {
    try {

      window.Cesium = await import('cesium');

      // 1. 加载地形数据
      const terrainProvider = await CesiumTerrainProvider.fromIonAssetId(1, {
        requestVertexNormals: true
      });

      // 2. 初始化Viewer
      this._viewer = new Viewer(container, {
        terrainProvider,
        infoBox: false,
        selectionIndicator: false,
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        // 优化配置
        targetFrameRate: 60,
        useDefaultRenderLoop: true
      });

      // 3. 后续优化
      this._configurePostInit();
    } catch (error) {
      console.error('Cesium初始化失败:', error);
      throw error;
    }
  }

  private _configurePostInit() {
    if (!this._viewer) return;

    // 禁用不需要的功能
    this._viewer.scene.fog.enabled = false;
    this._viewer.scene.skyAtmosphere.show = false;
    this._viewer.scene.moon.show = false;
    
    // 强制使用WebGL2

  }

  get viewer(): Viewer {
    if (!this._viewer) throw new Error('Cesium未初始化完成');
    return this._viewer;
  }

  get ready(): Promise<void> {
    return this._readyPromise;
  }
}