<template>
    <div ref="mapContainer" class="map-container"></div>

    <div class="control-panel">
        <label>
            <input 
                type="checkbox"
                v-model="showFlightTrack"
                @change="toggleFlightTrack"
            >
            显示飞行轨迹
        </label>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { MapEngineFactory } from '@/lib/layer/map-engine-factory';
import {type IMapEngine} from '@/lib/layer/engine/IMapEngine';
import { LayerType, type LayerOptions, type LayerData, EngineType, type ILayer } from '@/lib/layer/types';

export default defineComponent({
    name: 'MapViewer',
    props: {
        engineType: {
            type: String as PropType<EngineType>,
            default: EngineType.CESIUM,
            validate: (value: string) => Object.values(EngineType).includes(value as EngineType)
        },
        layers: {
            type: Array as PropType<Array<{
                type: LayerType,
                data: LayerData,
                options: LayerOptions
            }>>,
            default: () => [],
        },
        mapOptions: {
            type: Object,
            default: () => ({}),
        },
        flightData: {
            type: Array<{longitude: number; latitude: number; height: number}>,
            default: () => [],
        }
    },
    setup(props) {
        console.log("MapViewer props:", props);
        const mapContainer = ref<HTMLElement>();
        let mapEngine: IMapEngine;
        let mapInstance: any;
        let flightTrackController: any = null;

        const showFlightTrack = ref(false);

        const currentLayers = new Map<String, ILayer>();

        // Initialize the map engine and layers
        const initMap = async () => {
            console.log("Map container:", mapContainer.value);
            console.log("Initializing map with engine:", props.engineType);
            if (!mapContainer.value) return;

            // Create the map engine instance
            mapEngine = MapEngineFactory.getEngine(props.engineType);
            mapEngine.createMap(mapContainer.value);

            // Add layers to the map
            props.layers.forEach(async layer => {
                const layerInstance = await mapEngine.createLayer(layer.type, layer.data, layer.options);
                layerInstance.addTo();
                currentLayers.set(layer.data.id, layerInstance);
            });
        };

        const toggleFlightTrack = async () => {
            console.log("Toggling flight track visibility:", showFlightTrack.value);
            if (!mapContainer.value) return;

            if (showFlightTrack.value) {
                 flightTrackController = await mapEngine.addFlightTrack({
                    data: props.flightData,
                    modelUri: 'Zv2eybVsGrYSwUFj_Cesium_Air.glb', // Cesium Ion资产ID
                    startTime: '2020-06-25T23:10:00Z',
                    timeStep: 30, // seconds
                    playBackSpeed: 10, // playback speed multiplier
                    showPath: true,
                });

                flightTrackController.track();
            } else {
                // 移除轨迹
                flightTrackController?.remove();
                flightTrackController = null;
            }
        }
        // destroy the map on unmount
        const destroyMap = () => {
            if (mapInstance) {
                currentLayers.forEach(layer => layer.remove());
                currentLayers.clear();
                // cesium specific cleanup
                mapInstance?.destroy?.();
                // leaflet specific cleanup
                mapInstance?.remove?.();
            }
        }

        onMounted(initMap);
        onBeforeUnmount(destroyMap);

        // Watch for changes of engineType prop
        watch(() => props.engineType, () => {
            destroyMap();
            initMap();
        });

        // Watch for changes in layers prop
        // 监听图层变化
        watch(() => props.layers, (newLayers) => {
            // 差异比较更新逻辑（简化版：全量更新）
            currentLayers.forEach((_, id) => {
                currentLayers.get(id)?.remove();
                currentLayers.delete(id);
            });

            newLayers.forEach(layer => {
                const layerInstance = mapEngine.createLayer(layer.type, layer.data, layer.options);
                layerInstance.addTo();
                currentLayers.set(layer.options.id, layerInstance);
            });
        }, { deep: true });

        return { mapContainer, showFlightTrack, toggleFlightTrack };
    }

})
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 100%;
}
/* 控制面板样式 */
.control-panel {
  position: absolute; /* 绝对定位 */
  top: 20px;
  left: 20px;
  z-index: 1000; /* 确保显示在最上层 */
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-family: Arial, sans-serif;
}
</style>