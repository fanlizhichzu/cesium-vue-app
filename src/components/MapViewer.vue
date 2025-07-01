<template>
    <div class="map-container">
        <!-- 地图容器 -->
        <div ref="mapContainer" class="map-view"></div>

        <!-- 控制面板 -->
        <div class="control-panel">
            <button @click="toggleViewMode">
                {{ is3D ? '切换到2D' : '切换到3D' }}
            </button>
        </div>

    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import type { PropType } from 'vue'
import UnifiedMapEngine from '@/lib/layer/engine/UnifiedMapEngine';
// 定义坐标类型
type Coordinate = [number, number];

export default defineComponent({
    name: 'MapViewer',
    props: {
        center: {
            type: Object as PropType<Coordinate>,
            required: true,
            validator: (value: unknown) => {
                return Array.isArray(value) &&
                    value.length === 2 &&
                    typeof value[0] === 'number' &&
                    typeof value[1] === 'number';
            }
        },
        zoom: {
            type: Number,
            default: 10
        },
        layers: {
            type: Array as () => Array<{
                id: string;
                type: string;
                source: string | object;
            }>,
            default: () => []
        }
    },
    setup(props) {
        // 地图实例引用
        const mapContainer = ref<HTMLElement>();
        const mapEngine = ref<UnifiedMapEngine>();
        const is3D = ref(false);

        // 初始化地图
        const initMap = async () => {
            if (!mapContainer.value) return;

            mapEngine.value = new UnifiedMapEngine();
            await mapEngine.value.createMap(mapContainer.value);

            // 添加初始图层
            props.layers.forEach(async layer => {
                await mapEngine.value?.addLayer(layer);
            });

            // 设置初始视图
            setView({
                center: props.center,
                zoom: props.zoom
            });

            // 监听事件
            mapEngine.value.on('click', handleMapClick);
        };

        // 切换二三维视图
        const toggleViewMode = () => {
            is3D.value = !is3D.value;
            setView({
                center: props.center,
                zoom: props.zoom,
                height: is3D.value ? 5000 : undefined
            });
        };

        // 设置视图
        const setView = (config: {
            center: [number, number];
            zoom: number;
            height?: number;
        }) => {
            mapEngine.value?.setView({
                center: config.center,
                zoom: config.zoom,
                height: config.height
            });
        };

        // 地图点击事件处理
        const handleMapClick = (event: any) => {
            console.log('地图点击:', event);
            // 可以在这里实现点击查询等功能
        };

        // 组件挂载时初始化
        onMounted(() => {
            initMap().catch(console.error);
        });

        // 组件卸载时清理
        onBeforeUnmount(() => {
            mapEngine.value?.destroy();
        });


        return {
            mapContainer,
            is3D,
            toggleViewMode,
        };
    }
});
</script>
  
<style scoped>
.map-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.map-view {
    width: 100%;
    height: 100%;
}

.control-panel {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 4px;
    display: flex;
    gap: 8px;
}

.control-panel button {
    padding: 6px 12px;
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.measurement-result {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    z-index: 1000;
}
</style>