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
            default: '2025-06-25T23:10:00Z'
        },
        timeStep: {
            type: Number,
            default: 30 // seconds
        },
        playBackSpeed: {
            type: Number,
            default: 10 // playback speed multiplier
        },
        modelAssetId: {
            type: [String, Number] as PropType<string | number>,
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
    },
    setup(props) {
        let airplaneEntity: Cesium.Entity | undefined;
        const positionProperty = new Cesium.SampledPositionProperty();

        // 初始化时钟和轨迹
        const initFlightTrack = () => {
            if (!props.viewer || props.flightData?.length) {
                return;
            }

            // 计算时间范围
            const totalSeconds = (props.flightData.length - 1) * props.timeStep;
            const startTime = Cesium.JulianDate.fromIso8601(props.startTime);
            const endTime = Cesium.JulianDate.addSeconds(startTime, totalSeconds, new Cesium.JulianDate());

            // 设置时钟
            props.viewer.clock.startTime = startTime.clone();
            props.viewer.clock.currentTime = startTime.clone();
            props.viewer.clock.stopTime = endTime.clone();
            props.viewer.clock.multiplier = props.playBackSpeed;
            props.viewer.clock.shouldAnimate = true;
            props.viewer.timeline.zoomTo(startTime, endTime);

            // 添加轨迹点
            
        }
    }
})

</script>