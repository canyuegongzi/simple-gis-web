import 'mapbox-gl/dist/mapbox-gl.css';
import MapService from '../common/MapService';
import { MapTypeEnum } from '@/map/type/CommonType';
import CommonStore from '../common/CommonStore';
import { MapBoxInstanceOptions } from '@/map/type/MapBoxType';
import { Map, LngLat, Marker, MarkerOptions, AnySourceImpl } from 'mapbox-gl';

export default class MapBoxService extends MapService {
    constructor(props: MapBoxInstanceOptions) {
        super();
    }

    private layerUrl: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

    private accessToken: string = 'sk.eyJ1IjoiY2FueXVlZ29uZ3ppIiwiYSI6ImNrcW9tZ3cyNTBubGsydXN0a3Jsbm4xcmIifQ.DE0PuTPkSv934P1tqFekkg';

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
        const Mapboxgl: any = window.mapboxgl;
        // const map: Map = new Map({
        const map: Map = new Mapboxgl.Map({
            container: props.id,
            // style: 'http://yapi.fpi-inc.site/mock/1069/one-map/mapbox/style/hz.json',
            // style: 'http://yapi.fpi-inc.site/mock/1069/one-map/mapbox/style/img.json',
            // style: 'http://yapi.fpi-inc.site/mock/1069/one-map/mapbox/style/ter.json',  // 地形
            // style: 'https://gis-dev.fpi-inc.site/resource/gis/hz/ter.json',  // 地形
            // style: 'https://gis-dev.fpi-inc.site/resource/gis/hz/img.json',  // 地形
            style: 'https://gis-dev.fpi-inc.site/resource/gis/hz/street.json',  // 白色地图

            // style: 'mapbox://styles/mapbox/navigation-day-v1', // stylesheet location
            // style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
            // style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
            // style: 'mapbox://styles/mapbox/satellite-streets-v11',
            // style: 'mapbox://styles/mapbox/satellite-v9',
            // style: {
            //     version: 8,
            //     sources: {
            //         cartodb: {
            //             tiles: ['http://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
            //             // tiles: ['https://stamen-tiles-a.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png'],
            //             tileSize: 256,
            //             type: 'raster',
            //         },
            //     },
            //     layers: [
            //         {
            //             id: 'cartodb',
            //             type: 'raster',
            //             source: 'cartodb',
            //         },
            //     ],
            // },
            center: [120, 30],

            pitch: 60,
            // bearing: 80,

            maxZoom: 18,
            minZoom: 3,
            zoom: 8,
            accessToken: 'pk.eyJ1IjoiY2FueXVlZ29uZ3ppIiwiYSI6ImNrcW9sOW5jajAxMDQyd3AzenlxNW80aHYifQ.0Nz5nOOxi4-qqzf2od3ZRA',
        });
        CommonStore.setInstance(type, map);
        /*map.on('load', function () {
            map.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
            });
            // add the DEM source as a terrain layer with exaggerated height
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

            // add a sky layer that will show when the map is highly pitched
            map.addLayer({
                'id': 'sky',
                'type': 'sky',
                'paint': {
                    'sky-type': 'atmosphere',
                    'sky-atmosphere-sun': [0.0, 0.0],
                    'sky-atmosphere-sun-intensity': 15
                }
            });
        });*/
        return map;

    }

    /**
     * 加载一些图片到地图实例上
     */
    public async loadImages(imagesMap: Record<string, string>, map: Map) {
        return new Promise(async (resolve) => {
            try {
                let imageLoadPromise: any[] = [];
                for (let key in imagesMap) {
                    let imgSource: string = key;
                    if (!(window as any)._imgSourcePath) {
                        (window as any)._imgSourcePath = {};
                    }
                    if (!(window as any)._imgSourcePath.hasOwnProperty(imgSource)) {
                        (window as any)._imgSourcePath[imgSource] = imagesMap[key];
                    }
                    if (!map.hasImage(imgSource)) {
                        // 图片数据
                        let imageData: any;
                        try {
                            // 此处是base64 文件
                            imageData = imagesMap[imgSource];
                        } catch (e) {
                            throw new Error(e);
                        }
                        let img = new Image();
                        img.src = imageData;
                        imageLoadPromise.push(
                            new Promise(resolve => {
                                img.onload = e => {
                                    //避免重复加载
                                    if (!map.hasImage(imgSource)) {
                                        map.addImage(imgSource, img);
                                    }
                                    resolve(e);
                                };
                            }),
                        );
                    }

                }
                if (imageLoadPromise.length !== 0) {
                    await Promise.all(imageLoadPromise);
                    resolve(imagesMap);
                } else {
                    resolve(imagesMap);
                }
            } catch (e) {
                console.log(e);
                resolve(imagesMap);
            }
        });
    }

    /**
     * 显示或隐藏指定图层
     * @param layerId<string> 图层名称
     * @param showOrHide<String> 显示或隐藏。'show' | 'hide'
     * @param map 地图实例
     */
    public showOrHideMapLayerById(layerId: string, showOrHide: string, map: Map) {
        // 传参错误
        if (!['show', 'hide'].includes(showOrHide)) {
            throw new Error(` (_showOrHideMapLayerById:) 参数showOrHide不合法：${showOrHide}`);
        }
        let isVisible = showOrHide === 'show' ? 'visible' : 'none';
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', isVisible);
        }
    }

    /**
     * 添加数据资源（更新数据资源）
     * @param sourceName<string> 资源名称
     * @param jsonData<GeoJson> 地理数据
     * @param map
     * @param options<Object> （可选参数）
     */
    public async addSourceToMap(sourceName: string, jsonData: any, map: Map, options: Record<string, any> = {}) {
        if (!map.getSource(sourceName)) {
            map.addSource(sourceName, { type: 'geojson', data: jsonData, ...options });
        } else {
            const source: AnySourceImpl = map.getSource(sourceName);
            (source as any).setData(jsonData);
        }
    }

    /**
     * 组织GeoJson数据（要素列表套壳）
     * @param features<Array> 要素列表
     */
    public getCommonGeoJson(features = []) {
        return {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
            },
            features: features,
        };
    }

    /**
     * 渲染普通marker图层到地图
     * @param layerOption
     * @param map
     * @param andShow
     * @param beforeLayerId
     */
    public async renderMarkerLayer(layerOption: Record<string, any>, map: Map, andShow = true, beforeLayerId?: string) {
        return new Promise(resolve => {
            // 判断图层引用的source是否存在
            let layerId: string = layerOption.id;
            let tempSource: string = layerOption.source;
            if (!tempSource || (Object.prototype.toString.call(tempSource) === '[object String]' && !map.getSource(tempSource))) {
                throw new Error(` (_renderMapLayer:) 图层${layerId}指向的资源${tempSource}不存在`);
            }
            if (!(window as any)._mapLayerIdArr) {
                (window as any)._mapLayerIdArr = [];
            }
            // window._mapLayerIdArr 记录加载的图层id
            if (!(window as any)._mapLayerIdArr.includes(layerId) && layerId.indexOf('Cluster') === -1) {
                (window as any)._mapLayerIdArr.push(layerId);
            }
            // 加载图层
            if (!map.getLayer(layerId)) {
                map.addLayer(layerOption as mapboxgl.AnyLayer, beforeLayerId);
                return resolve(layerId);
            } else {
                // 地图中已经存在该图层
                if (andShow) this.showOrHideMapLayerById(layerId, 'show', map);
                // 此时不再返回图层名字。（并且无需再次绑定事件）
                resolve(layerId);
            }

        });
    }

    /**
     * 渲染聚合点位
     * @param config<Object>
     *              jsonData       <JSON | (): JSON => void>            当需要渲染cluster 类型时需要的点位数据
     *              clusterName    <String | (): String => void>        当需要渲染cluster 类型时注册的图层名称
     *              clusterColor   <String | (): String => void>        当需要渲染cluster 类型时聚合的颜色
     *              getCircleStyle <Object | (): String => void>        当需要渲染cluster 类型时最大级别的icon样式     example: {'circle-radius': 6, 'circle-color': '#606266' }
     *              clusterProperties <Object>                          当需要渲染cluster 绑定的聚合属性     example: { sum: ['+', ['get', 'runState']], },
     *              layoutText     <Object>                             当需要渲染cluster 文字自定义         example: layout: { 'text-field': '{sum}', 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'], 'text-size': 12, 'icon-ignore-placement': true, },
     *              unClusterLayerStyle     <Object>                    未聚合点的图层配置
     *              clusterCountLayerStyle     <Object>                 聚合点中间默认的文字配置
     * @param map
     * @param clickCallback<Function> 点击回调函数
     */
    public async renderClusterMakerLayer(config: any = {}, map: Map, clickCallback?: () => {}) {
        const {
            jsonData,
            clusterName,
            clusterColor,
            getCircleStyle,
            clusterProperties,
            layoutText,
            unClusterLayerStyle,
            clusterCountLayerStyle,
        } = config as any;
        if (!map.getSource(clusterName)) {
            map.addSource(clusterName, {
                type: 'geojson',
                data: jsonData,
                cluster: true,
                clusterRadius: 80,
                clusterMaxZoom: 14,
                clusterMinPoints: 5,
                clusterProperties: clusterProperties || {},
            });
        } else {
            (map.getSource(clusterName) as any).setData(jsonData);
        }
        // 默认的样式（未聚合的点位）
        const iconDefaultStyle = typeof getCircleStyle === 'function' ? getCircleStyle(clusterName) : getCircleStyle;
        map.addLayer({
            id: clusterName + '-clusters',
            type: 'circle',
            source: clusterName,
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': clusterColor,
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    12, //聚合小于5的圆半径
                    5,
                    16, //聚合da于5的圆半径
                    20,
                    20, //聚合大于20的圆半径
                ],
            },
        });
        // 聚合点中间默认的文字配置
        const defaultClusterCountLayerStyle: Record<string, any> = {
            id: clusterName + 'cluster-count',
            type: 'symbol',
            source: clusterName,
            filter: ['has', 'point_count'], //有point_count属性的，为聚合点
            layout: layoutText || {
                'text-field': '{point_count}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
                'icon-ignore-placement': true,
            },
            paint: { 'text-color': '#fff', 'text-opacity': 1 },
        };
        map.addLayer(clusterCountLayerStyle ? { ...clusterCountLayerStyle, ...defaultClusterCountLayerStyle } : defaultClusterCountLayerStyle);
        // 未聚合点的图层配置
        const defaultUnClusterLayerStyle: Record<string, any> = {
            id: clusterName + '-UnCluster',
            type: 'circle',
            source: clusterName,
            filter: ['!', ['has', 'point_count']],
            paint: iconDefaultStyle,
        };
        // 未聚合点UnCluster
        map.addLayer(unClusterLayerStyle ? { ...unClusterLayerStyle, ...defaultUnClusterLayerStyle } : defaultUnClusterLayerStyle);
        map.on('click', clusterName + '-clusters', e => {
            let features: any = map.queryRenderedFeatures(e.point, { layers: [clusterName + '-clusters'] });
            let clusterId = features[0].properties.cluster_id;
            (map.getSource(clusterName) as any).getClusterExpansionZoom(clusterId, function(err: any, zoom: number) {
                if (err) return;
                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom,
                });
            });
        });
        return { clusterName, layerName: clusterName + '-UnCluster' };
    }

    /**
     * 移除聚合图层
     * @param clusterName
     * @param map
     */
    public removeClusterLayer(clusterName: string, map: Map) {
        const layers = [clusterName + '-clusters', clusterName + 'cluster-count', clusterName + '-UnCluster'];
        if (map.getSource(clusterName)) {
            for (let i = 0; i < layers.length; i++) {
                try {
                    map.removeLayer(layers[i]);
                } catch (e) {
                    console.warn(e);
                }
            }
        }
    }

    /**
     * 注册聚合图层点击事件
     * @param clusterName
     * @param layerName
     * @param map
     * @param clickCallback
     */
    public clusterMakerClickCallback(clusterName: string, layerName: string, map: Map, clickCallback?: any) {
        map.on('click', layerName, (e: any) => {
            let coordinates = e.features[0].geometry.coordinates.slice();
            if (typeof clickCallback === 'function') {
                clickCallback(coordinates, e.features[0].properties, clusterName);
            }
        });
    }

    /**
     * 创建marker
     * @param options
     */
    public createMarker(options?: MarkerOptions): Marker {
        return new Marker(options);
    }

}
