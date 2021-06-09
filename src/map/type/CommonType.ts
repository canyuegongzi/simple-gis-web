import { CesiumInstanceOptions } from '../type/CesiumType';
import { LeafletInstanceOptions } from '../type/LeafletType';
import { MapBoxInstanceOptions } from '../type/MapBoxType';

export const MapTypeList: MapTypeEnum[] = ['CESIUM', 'LEAFLET', 'MAPBOX'];
/**
 * 地图类型
 */
export type MapTypeEnum = 'CESIUM' | 'LEAFLET' | 'MAPBOX';

/**
 * 图层类型
 */
export type LayerImagesEnum = 'AMAP' | 'BAIDU' | 'TIANDITU' | 'GOOGLEMAP';

/**
 * 点位坐标
 */
export interface MapPoint {
    lng: any;
    lat: any;
}
/**
 * 地图初始化参数
 */
export type MapInitOptions = CesiumInstanceOptions | LeafletInstanceOptions | MapBoxInstanceOptions;

/**
 * 坐标系
 */
export type CrsConfigEnum = 'WGS84' | 'BD09' | 'GCJ02';
/**
 * 图层样式
 */
export type LayerCesiumStyleConfigEnum = 'img' | 'elec' | 'cva' | 'vec';
/**
 * 图层修改配置
 */
export interface ChangeLayerImageConfig {
    style: LayerCesiumStyleConfigEnum, // style: img、elec、cva
    crs: CrsConfigEnum // 使用84坐标系，默认为：GCJ02
}
/**
 * 地图对外暴露的方法
 */
export abstract class BaseMap {
    /**
     * 初始化地图
     * @param type
     * @param props
     */
    abstract initMapInstance(type: MapTypeEnum, props: CesiumInstanceOptions): any;

    abstract changeLayer<T>(type: LayerImagesEnum, config: ChangeLayerImageConfig, instance: T): T;
}
