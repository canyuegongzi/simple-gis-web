import { CesiumInstanceOptions } from '@/map/type/CesiumType';
import { LeafletInstanceOptions } from '@/map/type/LeafletType';
import { MapBoxInstanceOptions } from '@/map/type/MapBoxType';

export const MapTypeList: MapTypeEnum[] = ['CESIUM', 'LEAFLET', 'MAPBOX'];
/**
 * 地图类型
 */
export type MapTypeEnum = 'CESIUM' | 'LEAFLET' | 'MAPBOX';

/**
 * 地图初始化参数
 */
export type MapInitOptions = CesiumInstanceOptions | LeafletInstanceOptions | MapBoxInstanceOptions;
