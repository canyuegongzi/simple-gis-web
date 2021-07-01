import 'mapbox-gl/dist/mapbox-gl.css';
import MapService from '../common/MapService';
import { MapTypeEnum } from '@/map/type/CommonType';
import CommonStore from '../common/CommonStore';
import { MapBoxInstanceOptions } from '@/map/type/MapBoxType';
import { Map, LngLat } from 'mapbox-gl';

export default class MapBoxService extends MapService {
    constructor(props: MapBoxInstanceOptions) {
        super();
    }

    private layerUrl: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

    private accessToken: string = 'sk.eyJ1IjoiY2FueXVlZ29uZ3ppIiwiYSI6ImNrcG1zenlzbzF0aXcydm84NWgwaHplZ2EifQ.4PgYDtWQe54iRN3EU2REcQ';

    /**
     * 初始化地图实例
     * @param type
     * @param props
     * @protected
     */
    public async initMapInstance(type: MapTypeEnum, props: MapBoxInstanceOptions) {
        const mapInstanceCache: any = await CommonStore.getInstance('MAPBOX');
        if (mapInstanceCache) {
            return mapInstanceCache;
        }
        const map: Map = new Map({
            container: props.id,
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [120, 30],
            maxZoom: 18,
            minZoom: 5,
            zoom: 9,
            accessToken: 'pk.eyJ1IjoiY2FueXVlZ29uZ3ppIiwiYSI6ImNrcG1zd2FnMTA0bjkydnQ4NjZmb25kMmkifQ.sdE-Rg4oWkO7UcduatFsmQ',
        });
        CommonStore.setInstance(type, map);
        return map;

    }

    /**
     * 渲染html marker
     * @param html
     * @param instance
     */
    public renderHtmlMarker<T>(html: string, instance: T): any {
        return null;
    }
}
