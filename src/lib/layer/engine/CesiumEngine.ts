// import { LayerType, type LayerOptions, type LayerData, type ILayer } from "../types";
// import * as Cesium from "cesium";
// import "cesium/Build/Cesium/Widgets/widgets.css";
// import { type IMapEngine } from './IMapEngine';
// import { createApp, h } from 'vue';

// export class CesiumMapEngine implements IMapEngine {
//     private _viewer: Cesium.Viewer | null = null;
//     private _readyPromise: Promise<void> | null = null;

//     async createMap(container: HTMLElement, options?: any) {
//         Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOTc4YTk0OS04Yzc0LTQ0NGItYmQ5Mi1mZDRiNTcwOTVmODEiLCJpZCI6MTc1NTUyLCJpYXQiOjE2OTg5MDU3NjF9.VPB-f81rQRFA72amiP_ja9CZvP4uSfTqLc2zRXAMPzM';
//         this._readyPromise = (async () => {
//             const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(
//                 1,
//                 {
//                     requestVertexNormals: true,
//                 }
//             );
//             this._viewer = new Cesium.Viewer(container, {
//                 terrainProvider: terrainProvider,
//                 infoBox: false,
//                 contextOptions: {
//                     powerPreference: 'high-performance',
//                     alpha: false // 禁用透明度提升Metal性能
//                 },
//                 ...options
//             });

//         })();
//         return this._readyPromise?.then(() => this._viewer!);
//     }

//     async createLayer(type: LayerType, data: LayerData, options: LayerOptions): Promise<ILayer> {
//         if (!this._readyPromise) throw new Error("Call createMap first");
//         await this._readyPromise;
//         if (!this._viewer) {
//             throw new Error("Viewer is not initialized. Call createMap first.");
//         }

//         // const osmBuildings = await Cesium.createOsmBuildingsAsync();
//         // this._viewer.scene.primitives.add(osmBuildings);

//         switch (type) {
//             case LayerType.GeoJSON:
//                 console.log("Creating Cesium GeoJSON Layer");
//                 return new CesiumGeoJsonLayer(this._viewer, data as GeoJSON.FeatureCollection, options);
//             // 其他Cesium图层类型...
//             default:
//                 throw new Error(`Cesium unsupported layer type: ${type}`);
//         }
//     }

//     async addFlightTrack(options: {
//         data: Array<{ longitude: number; latitude: number; height: number }>;
//         startTime: string;
//         timeStep: number;
//         modelUri: string;
//         playBackSpeed: number;
//         showPath: boolean;
//     }): Promise<{
//         track: () => void;
//         remove: () => void;
//     }> {
//         let airplaneEntity: Cesium.Entity | undefined;
//         const positionProperty = new Cesium.SampledPositionProperty();
//         if (!this._readyPromise) throw new Error("Call createMap first");
//         await this._readyPromise;
//         if (!this._viewer) {
//             throw new Error("Viewer is not initialized. Call createMap first.");
//         }
        
//         // 计算时间范围
//         const totalSeconds = (options.data.length - 1) * options.timeStep;
//         const startTime = Cesium.JulianDate.fromIso8601(options.startTime);
//         const endTime = Cesium.JulianDate.addSeconds(startTime, totalSeconds, new Cesium.JulianDate());

//         // 初始化时钟和轨迹
//         console.log("Initializing flight track with data:", options.data);
//         if (!this._viewer || !options.data?.length) {
//             console.error("Flight data is empty, skipping initialization.");
//             return {
//                 track: () => {},
//                 remove: () => {}
//             };
//         }
//         // 设置时钟
//         this._viewer.clock.startTime = startTime.clone();
//         this._viewer.clock.currentTime = startTime.clone();
//         this._viewer.clock.stopTime = endTime.clone();
//         this._viewer.clock.multiplier = options.playBackSpeed;
//         this._viewer.clock.shouldAnimate = true;
//         this._viewer.timeline.zoomTo(startTime, endTime);

//         // 添加轨迹点
//         options.data.forEach((dataPoint, i) => {
//             const time = Cesium.JulianDate.addSeconds(startTime, i * options.timeStep, new Cesium.JulianDate());
//             const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
//             positionProperty.addSample(time, position);

//             if (options.showPath && this._viewer) {
//                 this._viewer.entities.add({
//                     position: position,
//                     point: {
//                         pixelSize: 10,
//                         color: Cesium.Color.RED,
//                     }
//                 });
//             }
//         });

//         // 创建飞机模型实体
//         airplaneEntity = this._viewer.entities.add({
//             availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
//                 start: startTime,
//                 stop: endTime
//             })]),
//             position: positionProperty,
//             model: {
//                 uri: options.modelUri,
//             },
//             // 模型沿着轨迹方向
//             orientation: new Cesium.VelocityOrientationProperty(positionProperty),
//             path: options.showPath ? new Cesium.PathGraphics({
//                 width: 3,
//             }) : undefined
//         });

//         return {
//             track: () => {
//                 if (this._viewer && airplaneEntity) {
//                     console.log("Tracking airplane entity:", airplaneEntity);
//                     this._viewer.trackedEntity = airplaneEntity;
//                 }
//             },
//             remove: () => {
//                 if (this._viewer && airplaneEntity) {
//                     this._viewer.entities.remove(airplaneEntity);
//                     this._viewer.trackedEntity = undefined;
//                 }
//             }
//         }
//     }
// }

// class CesiumGeoJsonLayer implements ILayer {
//     private dataSource: Cesium.GeoJsonDataSource | null = null;

//     constructor(private readonly viewer: Cesium.Viewer, private data: GeoJSON.FeatureCollection, private options: LayerOptions) { }

//     async addTo() {
//         console.log("Adding Cesium GeoJSON Layer");
//         this.dataSource = await Cesium.GeoJsonDataSource.load(this.data, {
//             stroke: Cesium.Color.HOTPINK,
//             fill: Cesium.Color.PINK.withAlpha(0.5),
//             strokeWidth: 3,
//             ...this.options
//         });
//         this.viewer.dataSources.add(this.dataSource);
//     }

//     remove(): void {
//         if (this.dataSource && this.dataSource.entities) {
//             this.dataSource.entities.removeAll();
//         }
//     }

//     setVisible(visible: boolean): void {
//         if (this.dataSource) {
//             this.dataSource.show = visible;
//         }
//     }

//     updateData(data: any): void {
//         this.data = data;
//         this.remove()
//         this.addTo();
//     }
// }