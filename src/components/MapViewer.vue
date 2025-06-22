<template>
    <div ref="mapContainer" class="map-container"></div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref, onMounted, onBeforeUnmount, watch} from 'vue';
import { MapEngineFactory, type IMapEngine } from '@/lib/layer/map-engine-factory';
import { LayerType, type LayerOptions, type LayerData, EngineType, type ILayer } from '@/lib/layer/types';
import { latLng } from 'leaflet';

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
        }
    },
    setup(props) {
        const mapContainer = ref<HTMLElement>();
        let mapEngine: IMapEngine;
        let mapInstance: any;

        const currentLayers = new Map<String, ILayer>();

        // Initialize the map engine and layers
        const initMap = () => {
            console.log("Initializing map with engine:", props.engineType);
            if (!mapContainer.value) return;

            // Create the map engine instance
            mapEngine = MapEngineFactory.getEngine(props.engineType);
            mapInstance = mapEngine.createMap(mapContainer.value);

            // Add layers to the map
            props.layers.forEach(layer => {
                const layerInstance = mapEngine.createLayer(layer.type, layer.data, layer.options);
                layerInstance.addTo(mapInstance);
                currentLayers.set(layer.data.id, layerInstance);
            });

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
            };

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
            
        }
        return {mapContainer};
    }

})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>