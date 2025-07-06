import Map from 'ol/Map';
import View from 'ol/View';
import ImageLayer from 'ol/layer/Image';
import TileLayer from 'ol/layer/Tile';
import { ImageWMS, XYZ } from 'ol/source';
import {defaults as olControlDefaults} from 'ol/control.js';

export class OLMap {
    private map: Map;
    constructor(target: string) {
        const imageWMSSource = new ImageWMS({
            url: 'https://ahocevar.com/geoserver/wms',
            params: {
                'LAYERS': 'topp:states',
            },
            ratio: 1,
            crossOrigin: 'anonymous',
        });

        this.map = new Map({
            layers: [
                new TileLayer({
                    source: new XYZ({
                      url: 'http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=332c51c337e6b2618bf95e421908e401',
                      crossOrigin: "anoymous",
                      wrapX: false
                    })
                  }),
                new ImageLayer({
                    extent: [-13884991, 2870341, -7455066, 6338219],
                    source: imageWMSSource,
                }),
            ],
            controls: olControlDefaults({
                attributionOptions: {
                    collapsible: false
                }
            }),
            target,
            view: new View({
                center: [-10967567.978507737, 4204193.972847062],
                zoom: 2,
            }),
        });
    }

    getMapInstance(): Map {
        return this.map;
    }

    addTileLayer(source: any, options: any): void {
        const tileLayer = new TileLayer({
            source: source,
            ...options,
        });
        this.map.addLayer(tileLayer);
    }

    addImageLayer(source: any, options: any): void {
        const imageLayer = new ImageLayer({
            source: source,
            ...options,
        });
        this.map.addLayer(imageLayer);
    }

    destroy(): void {
        this.map.setTarget(undefined);
        this.map.dispose();
    }
}
