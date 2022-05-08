/**
 * leaflet 地图基本方法
 */
import {
    BaseIconOptions, CircleMarker, CircleMarkerOptions,
    CRS,
    DivIcon,
    DivIconOptions, Icon,
    IconOptions,
    latLng,
    latLngBounds, LatLngExpression, Layer, LayerGroup, LayerOptions,
    Map,
    MapOptions, Marker, MarkerOptions, Polygon, Polyline, PolylineOptions,
    TileLayer
} from "leaflet";
import 'leaflet/dist/leaflet.css';
import { BaseLeafletServiceInterface } from "../interface";
import LeafletMarkerCluster from "./markerCluster/LeafletMarkerCluster";
const L = window.L;

export class BaseService implements BaseLeafletServiceInterface {
    public map!: Map;
    public leafletMarkerCluster!: LeafletMarkerCluster;

    constructor() {
        this.leafletMarkerCluster = new LeafletMarkerCluster(L);
    }

    public init(element: string | HTMLElement, options: MapOptions, callback?: (map: Map) => void): Map {
        this.map = new Map(element, this.getOptions(options));
        callback?.(this.map);
        return this.map;
    }

    public initLayer(titleLayer?: TileLayer.WMS): Map {
        titleLayer = titleLayer || new TileLayer.WMS('http://{s}.tile.osm.org/{z}/{x}/{y}.png',{
            format: 'image/png',
            layers: '全国县@全国县',
            transparent: true,
        });
        this.map?.addLayer(titleLayer);
        return this.map as Map;
    }

    public removeMap() {
        return this.map?.remove();
    }

    /**
     * 创建divIcon
     * @param options
     */
    public createDivIon(options?: DivIconOptions): DivIcon {
        return new DivIcon(options);
    }

    /**
     * 创建divIcon
     * @param latlngs
     * @param options
     */
    public createPolyline(latlngs: LatLngExpression[] | LatLngExpression[][], options?: PolylineOptions): Polyline {
        return new Polyline(latlngs, options);
    }

    /**
     * 创建面
     * @param latlngs
     * @param options
     */
    public createPolygon(latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options?: PolylineOptions): Polygon {
        return new Polygon(latlngs, options);
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
     * @param options?
     */
    public createMarker(latlng: LatLngExpression, options?: MarkerOptions): Marker {
        return new Marker(latlng, options)
    }

    /**
     * 绘制原点 marker
     * @param latlng
     * @param options
     */
    public createCircleMarker(latlng: LatLngExpression, options?: CircleMarkerOptions): CircleMarker {
        return new CircleMarker<any>(latlng, options);
    }

    /**
     * 多个图层合并成图层组
     * @param layers
     * @param options
     */
    public renderMarkerToGroupLayer(layers?: Layer[], options?: LayerOptions): LayerGroup {
        const layerGroup: LayerGroup = new LayerGroup(layers, options);
        this.map?.addLayer(layerGroup);
        return layerGroup;
    }

    protected getOptions(options: MapOptions): MapOptions {
        return {
            crs: CRS.EPSG3857,
            center: [32, 104],
            maxZoom: 18,
            minZoom: 5,
            maxBounds: latLngBounds(latLng(4, 73), latLng(54, 135)),
            zoom: 8,
            zoomControl: false,
            ...options
        }
    }

    public resetMap(latlng?: LatLngExpression): Map {
        this.map.invalidateSize(true);
        this.map.flyTo(latlng || [32, 100], 5)
        return this.map;
    }
}

