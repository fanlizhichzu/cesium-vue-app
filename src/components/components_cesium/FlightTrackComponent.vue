<template></template>


<script lang="ts">
import { defineComponent, type PropType, watch, onUnmounted } from 'vue';
import *  as Cesium from 'cesium';

export default defineComponent({
    name: 'FlightTrackComponent',
    props: {
        viewer: {
            type: Object as PropType<Cesium.Viewer>,
            required: true
        },
        flightData: {
            type: Array as PropType<Array<{
                longitude: number;
                latitude: number;
                height: number;
            }>>,
            required: true
        },
        startTime: {
            type: String,
            default: '2020-06-25T23:10:00Z'
        },
        timeStep: {
            type: Number,
            default: 30 // seconds
        },
        playBackSpeed: {
            type: Number,
            default: 10 // playback speed multiplier
        },
        modelUri: {
            type: String,
            default: 'Cesium_Air.glb'
        },
        showPath: {
            type: Boolean,
            default: true
        },
        showPoints: {
            type: Boolean,
            default: true
        },
        visible: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        let airplaneEntity: Cesium.Entity | undefined;
        const positionProperty = new Cesium.SampledPositionProperty();
        // 按需加载资源
        const loadResources = async () => {
            if (!props.visible) return;
            // 计算时间范围
            const totalSeconds = (props.flightData.length - 1) * props.timeStep;
            const startTime = Cesium.JulianDate.fromIso8601(props.startTime);
            const endTime = Cesium.JulianDate.addSeconds(startTime, totalSeconds, new Cesium.JulianDate());

            // 初始化时钟和轨迹
            console.log("Initializing flight track with data:", props.flightData);
            console.log("Initializing flight track with viewer:", props.viewer);
            if (!props.viewer || !props.flightData?.length) {
                return;
            }
            console.log("Flight data is empty, skipping initialization.");
            // 设置时钟
            props.viewer.clock.startTime = startTime.clone();
            props.viewer.clock.currentTime = startTime.clone();
            props.viewer.clock.stopTime = endTime.clone();
            props.viewer.clock.multiplier = props.playBackSpeed;
            props.viewer.clock.shouldAnimate = true;
            props.viewer.timeline.zoomTo(startTime, endTime);

            // 添加轨迹点
            props.flightData.forEach((dataPoint, i) => {
                const time = Cesium.JulianDate.addSeconds(startTime, i * props.timeStep, new Cesium.JulianDate());
                const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
                positionProperty.addSample(time, position);

                if (props.showPoints) {
                    props.viewer.entities.add({
                        position: position,
                        point: {
                            pixelSize: 5,
                            color: Cesium.Color.RED,
                            outlineColor: Cesium.Color.WHITE,
                            outlineWidth: 2
                        }
                    })
                }
            });

            // 创建飞机模型实体
            airplaneEntity = props.viewer.entities.add({
                availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                    start: startTime,
                    stop: endTime
                })]),
                position: positionProperty,
                model: {
                    uri: props.modelUri,
                },
                // 模型沿着轨迹方向
                orientation: new Cesium.VelocityOrientationProperty(positionProperty),
                path: props.showPath ? new Cesium.PathGraphics({
                    width: 3,
                }) : undefined
            });

            // 自动追踪
            props.viewer.trackedEntity = airplaneEntity;
        }

        watch(() => props.flightData, (newData) => {
            cleanup();
            if (newData?.length) {
                initFlightTrack();
            }
        }, { deep: true });

        watch(() => props.visible, (val) => {
            if (val) loadResources();
            else cleanup();
        }, { immediate: true });

        const cleanup = () => {
            if (airplaneEntity) {
                props.viewer.entities.remove(airplaneEntity);
            }
            positionProperty.removeSamples(new Cesium.TimeInterval({
                start: startTime,
                stop: endTime
            }));
        };

        onUnmounted(() => {
            cleanup();
        });

        return {
            // 暴露方法给父组件
            setTrackedEntity: () => {
                if (airplaneEntity) {
                    props.viewer.trackedEntity = airplaneEntity;
                }
            }
        };
    }

});

</script>