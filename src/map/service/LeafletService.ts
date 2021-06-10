import L, { Map, TileLayer, CRS, latLngBounds, latLng, LayerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapService from '../common/MapService';
import { LeafletInstanceOptions } from '../type/LeafletType';
import { BaseMap, ChangeLayerImageConfig, LayerImagesEnum, MapTypeEnum } from '@/map/type/CommonType';
import CommonStore from '../common/CommonStore';
import { baseLayers } from '../service/leaflet/imageryProvider';

export default class LeafletService extends MapService implements BaseMap {
    constructor(props: LeafletInstanceOptions) {
        super();
    }

    private layerUrl: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

    /**
     * 初始化地图实例
     * @param type
     * @param props
     * @protected
     */
    public async initMapInstance(type: MapTypeEnum, props: LeafletInstanceOptions) {
        const mapInstanceCache: any = await CommonStore.getInstance('LEAFLET');
        if (mapInstanceCache) {
            return mapInstanceCache;
        }
        const map: Map = new Map(props.id, {
            crs: CRS.EPSG3857,
            center: [30, 120],
            maxZoom: 18,
            minZoom: 5,
            maxBounds: latLngBounds(latLng(4, 73), latLng(54, 135)),
            zoom: 14
        });
        const titleLayer: TileLayer.WMS = new TileLayer.WMS(this.layerUrl,{
            format: 'image/png',
            layers: '全国县@全国县',
            transparent: true,
        });
        map.addLayer(titleLayer);
        CommonStore.setInstance(type, map);
        return map;
    }

    /**
     * 修改底图
     * @param type
     * @param config
     * @param instance
     */
    public changeLayer<T extends Map>(type: LayerImagesEnum, config: ChangeLayerImageConfig, instance: T): T {
        let layer: any = null;
        if (baseLayers.hasOwnProperty(type)){
            if (Array.isArray(baseLayers[type].url)) {
                const urls: any = [];
                for (let i = 0; i < baseLayers[type].url.length; i ++) {
                    urls.push(new TileLayer(baseLayers[type].url[i].url, baseLayers[type].url[i].options));
                }
                layer = new LayerGroup(urls);
            }else {
                layer = new TileLayer(baseLayers[type].url, baseLayers[type].url.options);
            }

        }
        instance.addLayer(layer);
        return instance;
    }
}
