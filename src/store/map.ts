import {defineStore} from 'pinia';
import type { Viewer } from 'cesium';
import { ref } from 'vue'

interface MapLayer {
    id: string;
    name: string;
    visible: boolean;
    value: any; // Replace 'any' with a more specific type if possible
}

export const userMapStore = defineStore('map', ()=>{
    const viewer = ref<Viewer | null>(null);
    const layers = ref<MapLayer[]>([]);
    
    function addLayer(layer: MapLayer) {
        if(!viewer.value) return
        layer.value.push(layer);
    }
    return {
        viewer,
        layers,
        addLayer,
    }
})