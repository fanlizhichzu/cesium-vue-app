import OLCesium from 'olcs';
import { Map as OLMap, View } from 'ol';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Stroke, Fill } from 'ol/style';
import * as Cesium from 'cesium';
import { throttle } from 'lodash-es';
import { type UnifiedLayer, type UnifiedViewState, type FlightTrackOptions, type FlightTrackController } from '../types';
import { CesiumManager } from './CesiumManager';


// 图层记录类型
interface LayerRecord {
    type: string;
    visible: boolean;
    zIndex: number;
    olLayer?: any;
    cesiumPrimitive?: any;
}

export default class UnifiedMapEngine {
    private olMap: OLMap;
    private ol3d: OLCesium;
    private layers: Map<string, LayerRecord> = new Map();
    private eventListeners: Map<string, Function[]> = new Map();
    private _cesiumManager: CesiumManager | null = null;

    constructor() {
        // 初始化空对象，防止运行时错误
        this.olMap = {} as OLMap; // Update this line
        this.ol3d = {} as OLCesium;
    }

    async createMap(container: HTMLElement): Promise<void> {
        // 清理现有容器
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // 先初始化Cesium
        this._cesiumManager = new CesiumManager(container);
        await this._cesiumManager.ready;

        console.log('cesiumManager ready:', this._cesiumManager.viewer);
        if (!this._cesiumManager.viewer) {
            throw new Error('Cesium Viewer未正确初始化');
        }

        // 创建双引擎容器
        const olContainer = document.createElement('div');
        const cesiumContainer = document.createElement('div');

        Object.assign(olContainer.style, {
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 0
        });

        Object.assign(cesiumContainer.style, {
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 1
        });

        container.append(olContainer, cesiumContainer);

        // 初始化OpenLayers
        this.olMap = new OLMap({
            target: olContainer,
            view: new View({
                center: fromLonLat([0, 0]),
                zoom: 2
            }),
            layers: []
        });

        // 初始化olcs桥接
        this.ol3d = new OLCesium({
            map: this.olMap,
            cesiumViewer: this._cesiumManager.viewer,
            timeFunction: () => Cesium.JulianDate.now()
        });
        this.ol3d.enableAutoRenderLoop();

        // 配置同步策略
        this._configureSync();

        // 初始化事件系统
        this._initEventSystem();
    }

    async addLayer(layer: any): Promise<string> {
        const layerId = `layer-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

        // 实际项目中根据layer.type处理不同图层类型
        const olLayer = new VectorLayer({
            source: new VectorSource({
                url: layer.source,
                format: new GeoJSON()
            })
        });

        this.olMap.addLayer(olLayer);

        this.layers.set(layerId, {
            type: layer.type,
            visible: true,
            zIndex: 0,
            olLayer
        });

        return layerId;
    }

    destroy(): void {
        if (this.ol3d) {
            this.ol3d.dispose();
        }
        if (this.olMap) {
            this.olMap.setTarget(undefined);
        }
        this.layers.clear();
    }

    private _configureSync(): void {
        if (!this.ol3d) return;

        this.ol3d.enableViewSync({
            projection: 'auto',
            view: 'both',
            zoom: 'cesium-led',
        });

        // 2D到3D视图同步
        this.olMap.getView().on('change:center', throttle(() => {
            const center = this.olMap.getView().getCenter();
            if (!center) return;

            const [lon, lat] = toLonLat(center);
            this._cesiumManager?.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lon, lat, this._cesiumManager?.viewer.camera.positionCartographic.height)
            });
        }, 100));
    }

    private _initEventSystem(): void {
        if (!this.olMap || !this.ol3d) return;

        this.olMap.on('click', (evt) => {
            const cesiumPick = this.ol3d.pickAtPixel(evt.pixel);
            this._emit('click', {
                olEvent: evt,
                cesiumPick,
                coordinate: evt.coordinate
            });
        });
    }

    private _emit(event: string, payload: any): void {
        const listeners = this.eventListeners.get(event) || [];
        listeners.forEach(fn => fn(payload));
    }

    // 公共事件接口
    on(event: string, callback: (event: any) => void): void {
        const listeners = this.eventListeners.get(event) || [];
        listeners.push(callback);
        this.eventListeners.set(event, listeners);
    }

    setView(state: UnifiedViewState) {
        if (!this.olMap || !this._cesiumManager?.viewer) return;

        // 设置OpenLayers视图
        const olView = this.olMap.getView();
        olView.setCenter(fromLonLat(state.center));
        olView.setZoom(state.zoom);

        // 设置Cesium视图
        this._cesiumManager.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(state.center[0], state.center[1], state.height || 1000),
            duration: 0.5
        });
    }
}