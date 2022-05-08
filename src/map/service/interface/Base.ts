import { Viewer } from "cesium";
import {MapOptions, Map, TileLayer} from "leaflet";
import {Map as MapboxMap, MapboxOptions} from 'mapbox-gl';

export abstract class BaseLeafletServiceInterface {
    /**
     * 地图初始化
     * @param element<string | HTMLElement> dom节点
     * @param options<MapOptions> leaflet 配置
     * @param callback
     */
    public abstract init(element: string | HTMLElement, options: MapOptions, callback: (map: Map) => void): Map


    /**
     * 地图销毁
     */
    public abstract removeMap(map: Map): void;

    /**
     *
     * 初始化默认图层
     * @param titleLayer
     */
    public abstract initLayer(titleLayer?: TileLayer.WMS): Map;
}

export abstract class BaseCesiumServiceInterface {
    /**
     * 地图初始化
     * @param element<string | HTMLElement> dom节点
     * @param options<MapOptions> cesium 配置
     * @param callback
     */
    public abstract init(element: string | HTMLElement, options: Viewer.ConstructorOptions, callback?: (viewer: Viewer) => void): Viewer
}

export abstract class BaseMapboxServiceInterface {
    /**
     * 地图初始化
     * @param element
     * @param options<MapOptions> cesium 配置
     * @param callback
     */
    public abstract init(element: string | HTMLElement, options: MapboxOptions, callback?: (viewer: MapboxMap) => void): MapboxMap
}

export interface MapInitEvent {
    initEvent: (...args: any[]) => void
}


