import './leaflet/load';
const L = window.L;
import { BaseIconOptions, CircleMarker, CircleMarkerOptions, CRS, DivIcon, DivIconOptions, Icon, IconOptions, latLng, latLngBounds, LatLngExpression, Layer, LayerGroup, LayerOptions, Map, Marker, MarkerOptions, TileLayer } from 'leaflet';
import MapService from '../common/MapService';
import { LeafletInstanceOptions } from '../type/LeafletType';
import { BaseMap, ChangeLayerImageConfig, LayerImagesEnum, MapTypeEnum } from '@/map/type/CommonType';
import CommonStore from '../common/CommonStore';
import { baseLayers } from '../service/leaflet/imageryProvider';
import LeafletMarkerCluster from './leaflet/markerCluster/LeafletMarkerCluster';

export default class LeafletService extends MapService implements BaseMap {
    public leafletMarkerCluster: LeafletMarkerCluster;
    constructor(props: LeafletInstanceOptions) {
        super();
        this.leafletMarkerCluster = new LeafletMarkerCluster(L);
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
            zoom: 14,
            zoomControl: false
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
            } else {
                layer = new TileLayer(baseLayers[type].url, baseLayers[type].url.options);
            }

        }
        instance.addLayer(layer);
        return instance;
    }

    /**
     * 创建divIcon
     * @param options
     */
    public createDivIon(options?: DivIconOptions): DivIcon {
        return new DivIcon(options);
    }

    /**
     * 创建普通的icon
     * @param options
     */
    public createIcon<T extends BaseIconOptions = IconOptions>(options: T): Icon<T> {
        return new Icon(options);
    }

    /**
     * 渲染marker
     * @param latlng
     * @param options
     */
    public createMarker(latlng: LatLngExpression, options?: MarkerOptions): Marker {
        return new Marker(latlng, options);
    }

    /**
     * 绘制原点 marker
     * @param latlng
     * @param options
     */
    public renderCircleMarker(latlng: LatLngExpression, options?: CircleMarkerOptions): CircleMarker {
        return new CircleMarker<any>(latlng, options);
    }

    /**
     * 多个图层合并成图层组
     * @param instance
     * @param layers
     * @param options
     */
    public renderMarkerToGroupLayer(instance: Map, layers?: Layer[], options?: LayerOptions): LayerGroup {
        const layerGroup: LayerGroup = new LayerGroup(layers, options);
        instance.addLayer(layerGroup);
        return layerGroup;
    }
}
