## 前言

随着前端开发趋于复杂化，地图（Gis）已经成为大多数系统必不可少的一部分，从最常见的 Gis 可视化（点、线、面、各种弹框、插值）到三维模型、场景模拟、场景监控等。主流的智慧园区、智慧城市、数字孪生等基本都离不开 webGis 的开发。

通过这篇文章，能够有这些收获：

- 了解常见的 webGis 的实现方式
- 通过 leaflet、cesium、mapBox 创建地图 
- 在 leaflet、cesium、mapBox 通过不同方式绘制 Marker

文章中相关代码均已提交到 github，欢迎 star。

[代码地址](https://github.com/canyuegongzi/simple-gis-web)

[预览地址](http://canyuegongzi.xyz/simple-gis-web/#/)

## 前端开发中的 Gis 方案

### 概述

#### leaflet

[leaflet官网](https://leafletjs.com/)

> Leaflet 是一个为建设移动设备友好的互动地图，而开发的现代的、开源的 JavaScript 库。它是由 Vladimir Agafonkin 带领一个专业贡献者团队开发，虽然代码仅有 38 KB，但它具有开发人员开发在线地图的大部分功能。

leaflet 可以通过简单的 Api 快速构建出简单的地图，结合其他的接口（Marker、 Popup、Icon、Polyline、Polygon等）即可快速实现点、线、面的绘制，社区中也有非常丰富的插件，可以低成本的实现诸如热力图、插值、聚合、数据可视化等功能，需要注意一点 leaflet 只能实现 2D 地图。

#### cesium

[cesium官网](https://www.cesium.com/)

> Cesium是国外一个基于JavaScript编写的使用WebGL的地图引擎。Cesium支持3D,2D,2.5D形式的地图展示，可以自行绘制图形，高亮区域，并提供良好的触摸支持，且支持绝大多数的浏览器和mobile。

cesium 最重要的是可以实现三维效果，如果项目中有加载模型（类似园区模型）、场景模拟的需求时，可以选用 cesium 的方式实现（针对预算不足，无法采购其他商用方案时）。

#### mapBox

[mapbox官网](https://www.mapbox.com/)

> Mapbox GL JS 是一个 JavaScript 库，它使用 WebGL，以 vector tiles 和 Mapbox styles 为来源，将它们渲染成互动式地图。它是 Mapbox GL 生态系统的一部分，其中还包括 Mapbox Mobile，它是一个用 C++ 编写的兼容桌面和移动平台的渲染引擎。

mapbox 也可以快速的实现三维效果、加载模型，与 cesium 比较 mapbox 的操作更加简单。

### 结论

以上只是列举了笔者常接触的几种技术方案，市面上也还有非常的多的解决方案，诸如 openlayers、百度地图、高德地图等。百度、高德提供的 sdk 也可以实现简单的 gis 效果，但不适用复杂效果的开发，笔者还是推荐对于复杂的地图效果使用专业 gis 解决方案。对于 leaflet、mapBox、cesium 从数据管理的方式做一下简单类比：

1：leaflet 以图层的方式管理数据，一切的数据（点、线、面）都可以看做成独立的图层，开发者只需要对相应的图层执行挂载、卸载即可；
2：mapbox 以资源的方式管理数据，mapbox 最常见的数据管理可以通过加载标准的 geoJson 数据，然后在后续的地图操作中可以指定相对应的资源 id；
3：对于普通的前端开发，cesium 推荐使用实体的方案管理地图中的数据，一切皆为实体。

在 gis 代码编写过程中需要注意代码的优化，及时的卸载各种事件的监听、数据的销毁、否则极容易造成地图的卡顿，cesium 要尤为注意。

## 地图创建

示例代码为降低 Gis 功能和 vue、react 等这种前端框架之间的耦合关系，笔者将基础的 Gis 功能抽象出了基础的类。

### leaflet

#### 封装

```ts

export default class LeafletService implements BaseMap {

    // 瓦片地图地址
    private layerUrl: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    
    constructor(props: LeafletInstanceOptions) {}

    /**
     * 初始化地图实例
     * @param type {MapTypeEnum} 地图类型
     * @param props {LeafletInstanceOptions} leaflet 初始化参数
     * @protected
     */
    public async initMapInstance(type: MapTypeEnum, props: LeafletInstanceOptions) {
        const mapInstanceCache: any = await CommonStore.getInstance('LEAFLET');
        if (mapInstanceCache) {
            return mapInstanceCache;
        }
        const map: Map = new Map(props.id, {
            crs: CRS.EPSG3857,   // 指定坐标系类型
            center: [30, 120],   // 地图中心点
            maxZoom: 18,         // 地图最大缩放级别
            minZoom: 5,          // 地图最小缩放级别
            maxBounds: latLngBounds(latLng(4, 73), latLng(54, 135)),
            zoom: 14,            // 默认缩放级别
            zoomControl: false,  // 是否显示放大缩小控件
            ...props
        });
        // 初始化一个 WMS 类型的 底图作为 leaflet 的地图 
        const titleLayer: TileLayer.WMS = new TileLayer.WMS(this.layerUrl,{
            format: 'image/png',
            layers: '全国县@全国县',
            transparent: true,
        });
        // 将底图添加到地图
        map.addLayer(titleLayer);
        // 缓存地图实例
        CommonStore.setInstance(type, map);
        return map;
    }
  
}
```

其中初始化地图采用 ```new Map()``` 操作，其中第一个属性为 dom 容器 id，第二个参数类型见 leaflet 中 index.d.ts 中 MapOptions 描述；

#### 使用

```ts

const leafletProps: LeafletInstanceOptions = { id: 'leaflet-container'};
const instance = new LeafletService(leafletProps);
// 调用 地图初始化 leaflet
const map: any = await instance.initMapInstance('LEAFLET', { id: 'leaflet-container' });
// 地图实例挂载在 window, 后续方便操作
(window as any).leafletMap = map;
```

### cesium

#### 封装

```ts

export default class CesiumService implements BaseMap{
    constructor(props: CesiumInstanceOptions) {}

    /**
     * 初始化地图实例
     * @param type {MapTypeEnum} 地图类型
     * @param props {CesiumInstanceOptions} 初始化参数
     * @protected
     */
    public async initMapInstance(type: MapTypeEnum, props: CesiumInstanceOptions): Promise<any> {
        const mapInstanceCache: any = await CommonStore.getInstance('CESIUM');
        if (mapInstanceCache) {
            return mapInstanceCache;
        }
        // 实例化 cesium 地图
        const map: Viewer = new Viewer(props.id, {
            ...CesiumService.mergeOptions(props),
        });
        CommonStore.setInstance(type, map);
        // 启用地球照明
        map.scene.globe.enableLighting = !!props.enableLighting;
        // 影藏掉底部的logo
        const logo: HTMLElement = document.querySelector('.cesium-viewer-bottom') as HTMLElement;
        if (logo) {
            logo.style.display = 'none';
        }
        // 默认启用三维效果
        map.scene.morphTo3D(0.0);

        //关闭快速抗锯齿,文字清晰
        map.scene.postProcessStages.fxaa.enabled = false;
        map.scene.highDynamicRange = false;

        //禁止相机入地
        map.scene.screenSpaceCameraController.minimumZoomDistance = 2500;   //原来是100
        (map.scene.screenSpaceCameraController as any)._minimumZoomRate = 30000;   //设置相机缩小时的速率
        map.clock.onTick.addEventListener(() => {
            if (map.camera.pitch > 0) {
                map.scene.screenSpaceCameraController.enableTilt = false;
            }
        });
        return map;
    }

    /**
     * 合并参数
     * @param props
     * @private
     */
    private static mergeOptions(config: CesiumInstanceOptions): CesiumInstanceOptions {
        const defaultParams: CesiumInstanceOptions = {
            id: config.id,
            animation: config.animation || false,
            baseLayerPicker: config.baseLayerPicker || false,
            fullscreenButton: config.fullscreenButton || false,
            vrButton: config.vrButton || false,
            geocoder: config.geocoder || false,
            homeButton: config.homeButton || false,
            infoBox: config.infoBox || false,
            sceneModePicker: config.sceneModePicker || false,
            selectionIndicator: config.selectionIndicator || false,
            timeline: config.timeline || false,
            navigationHelpButton: config.navigationHelpButton || false,
            scene3DOnly: true,
            navigationInstructionsInitiallyVisible: false,
            showRenderLoopErrors: false,
            imageryProvider: (config.templateImageLayerUrl
                ? new UrlTemplateImageryProvider({
                    url: config.templateImageLayerUrl,
                })
                : null) as UrlTemplateImageryProvider,
        };
        return defaultParams;
    }
}
```

其中初始化地图采用 ```new Map()``` 操作，其中第一个属性为 dom 容器 id，第二个参数类型见 cesium 中 index.d.ts 中 Viewer.ConstructorOptions 描述；

#### 使用

```ts

const cesiumProps: CesiumInstanceOptions = { id: 'cesium-container' };
const mapInstance = new CesiumService(cesiumProps);
// 初始化 cesium 地图
const map: Viewer = await this.cesiumMapInstance.initMapInstance('CESIUM', { id: 'cesium-container' });
// 地图实例挂载在 window, 后续方便操作
(window as any).cesiumMap = map;
```

### mapbox

#### 封装

```ts

export default class MapBoxService extends MapService {
    constructor(props: MapBoxInstanceOptions) {
        super();
    }
    /**
     * 初始化地图实例 {MapTypeEnum} 地图类型
     * @param type {MapBoxInstanceOptions} 地图初始化参数
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
            style: 'mapbox://styles/mapbox/satellite-v9',   // mapbox 预设了几种样式
            center: [120, 30],
            pitch: 60,
            bearing: 80,
            maxZoom: 18,
            minZoom: 5,
            zoom: 9,
            // 需要去mapbox 官网注册应用获取token
            accessToken: 'pk.eyJ1IjoiY2FueXVlZ29uZ3ppIiwiYSI6ImNrcW9sOW5jajAxMDQyd3AzenlxNW80aHYifQ.0Nz5nOOxi4-qqzf2od3ZRA',
            ...props
        });
        CommonStore.setInstance(type, map);
        return map;

    }
}
```

其中初始化地图采用 ```new Map()``` 操作，其中第一个属性为 dom 容器 id，第二个参数类型见 mapbox 中 index.d.ts 中 MapboxOptions 描述；

mapbox 预设的 style 如下：

1. mapbox://styles/mapbox/streets-v10
2. mapbox://styles/mapbox/outdoors-v10
3. mapbox://styles/mapbox/light-v9
4. mapbox://styles/mapbox/dark-v9
5. mapbox://styles/mapbox/satellite-v9
6. mapbox://styles/mapbox/satellite-streets-v10
7. mapbox://styles/mapbox/navigation-preview-day-v2
8. mapbox://styles/mapbox/navigation-preview-night-v2
9. mapbox://styles/mapbox/navigation-guidance-day-v2
10. mapbox://styles/mapbox/navigation-guidance-night-v2

#### 使用

```ts

const mapboxProps: MapBoxInstanceOptions = { id: 'mapbox-container' };
const instance = new MapBoxService(mapboxProps);
this.setMapInstance({ mapType: 'MAPBOX', instance });
const map: any = await instance.initMapInstance('MAPBOX', { id: 'mapbox-container' });
// 地图实例挂载在 window, 后续方便操作
(window as any).mapboxMap = map;

```

## 点位绘制

### leaflet

leaflet 中绘制 Marker 的方式很多，在此处主要列举三种：CircleMarker（普通的圆圈）、IconMarker（图标）、DivIconMarker（Dom）；在大数据情况下，如果采用 DivIconMarker 方式渲染点位会造成页面的卡顿，成本最低的解决方案是将点位图层转为 canvas 图层添加到地图上。

#### CircleMarker

CircleMarker 方式渲染点位是 leaflet 中最基本的方式，通过 ```new CircleMarker()``` 可以快速创建出 marker，第一个参数为位置信息数组（第一位为维度，第二位为经度），第二个参数为 CircleMarkerOptions （参数见 leaflet 的 index.d.ts）。

```ts
/**
* 渲染普通小圆点
*/
async function renderNormalCircleMarkerLeaflet() {
      // 此处为模拟数据 每一条数据中包含 经纬度信息
      const dataJson: any[] = await import('../../mock/stationList1.json');
      const markerList: any[] = [];
      for (let i = 0; i < dataJson.length; i++) {
          // 转换经纬度
          const latitude = parseFloat(dataJson[i].latitude);
          const longitude = parseFloat(dataJson[i].longitude);
          // leaflet 比较特殊， marker 位置信息 维度在前、经度在后
          const marker: any = new CircleMarker([latitude, longitude], {
              radius: 8,
          });
          markerList.push(marker);
      }
      // 将所有 marker 添加到一个图层组，移除点位时，只需要移除整个图层即可
      const layerGroup: LayerGroup = new LayerGroup(markerList, {});
      // 将图层组添加到地图上
      (window as any).leafletMap.addLayer(layerGroup);
}

```

#### IconMarker

IconMarker 是 leaflet 中常用的渲染点的方式，根据点位类型渲染不同的图标的 Marker，通过 ```new Marker()``` 可以快速创建出 marker，第一个参数为位置信息数组（第一位为维度，第二位为经度），第二个参数为 MarkerOptions （参数见 leaflet 的 index.d.ts），此类型的 Marker 主要的是需要构建出一个 Icon 类型的图标。

```ts
/**
* 渲染 IconMarker
*/
async function renderNormalIconMarkerLeaflet() {
      // 此处为模拟数据 每一条数据中包含 经纬度信息
      const dataJson: any[] = await import('../../mock/stationList1.json');
      const markerList: any[] = [];
      for (let i = 0; i < dataJson.length; i++) {
          const latitude = parseFloat(dataJson[i].latitude);
          const longitude = parseFloat(dataJson[i].longitude);
          // 创建一个 icon 
          const icon: Icon = new Icon({
              // 指定 icon 的图片
              iconUrl: require('../../assets/map/site.png'),
          });
          // leaflet 比较特殊， marker 位置信息 维度在前、经度在后
          const marker: any = new Marker([latitude, longitude], {
              icon: icon,
          });
          markerList.push(marker);
      }
      // 将所有 marker 添加到一个图层组，移除点位时，只需要移除整个图层即可
      const layerGroup: LayerGroup = new LayerGroup(markerList, {});
      // 将图层组添加到地图上
      (window as any).leafletMap.addLayer(layerGroup);
}

```

#### DivIconMarker

DivIconMarker 是在 leaflet 中采用 Dom 渲染点的方式，一般主要用于绘制过于复杂效果的点位，通过 ```new Marker()``` 可以快速创建出 marker，第一个参数为位置信息数组（第一位为维度，第二位为经度），第二个参数为 MarkerOptions （参数见 leaflet 的 index.d.ts），此类型的 Marker 主要的是需要构建出一个 DivIcon 类型的图标。

```ts
/**
* 渲染 DivMarker
*/
async function renderDivIconMarkerLeaflet() {
      // 此处为模拟数据 每一条数据中包含 经纬度信息
      const dataJson: any[] = await import('../../mock/stationList1.json');
      const markerList: any[] = [];
      for (let i = 0; i < dataJson.length; i++) {
          const latitude = parseFloat(dataJson[i].latitude);
          const longitude = parseFloat(dataJson[i].longitude);
          // 创建一个 dom 类型的 icon 
          const icon: DivIcon = new DivIcon({
              html: `
                        <div class="leaflet-icon-item">
                          <span>${i}</span>
                        </div>
                      `,
              className: 'leaflet-div-icon', // 给 marker 指定一个 class 
          });
          // leaflet 比较特殊， marker 位置信息 维度在前、经度在后
          const marker: any = new Marker([latitude, longitude], {
              icon: icon,
          });
          markerList.push(marker);
      }
      // 将所有 marker 添加到一个图层组，移除点位时，只需要移除整个图层即可
      const layerGroup: LayerGroup = new LayerGroup(markerList, {});
      // 将图层组添加到地图上
      (window as any).leafletMap.addLayer(layerGroup);
}

```

### cesium

cesium 中绘制 Marker 的方式主要有两种，第一种是采用 Entity 方式绘制，第二种是通过加载 geoJson 数据的方式绘制点位。

#### Entity

Entity 方式时 cesium 中最基本的类，可以基于 Entity 绘制任何图层，Entity 构造函数的参数非常多，建议参考官网介绍。

```ts
/**
* 渲染 Entity 类型的点位
*/
async function renderEntityMarkerCesium() {
    // 模拟点位数据
    const dataJson: any[] = await import('../../mock/stationList1.json');
    const markerList: Entity[] = [];
    for (let i = 0; i < dataJson.length; i++) {
        const latitude = parseFloat(dataJson[i].latitude);
        const longitude = parseFloat(dataJson[i].longitude);
        // 创建实体 
        const marker: Entity = new Entity({
            name: dataJson[i].name,   // 点位名称
            description: JSON.stringify(dataJson[i]),  // 给每一个点位绑定一些其他属性
            position: Cartesian3.fromDegrees(longitude, latitude),  // 点位信息  将经纬度坐标WGS84转换为Cartesian3
            billboard: {
                image: require('../../assets/map/site-5.png'), // 点位图片
                scale: 1,
                pixelOffset: new Cartesian2(0, -10),  // 位置偏移量
            },
        });
        normalIcon.push(marker);
        (window as any).cesiumMap.entities.add(marker);
    }
    return markerList;
}
```
#### geoJson

geoJson 数据格式是地理空间系统中最常见的数据交互格式，cesium 可以通过 GeoJsonDataSource.load() 方式加载数据到地图，然后再重载点位实体信息即可。

不太熟悉geoJson的请参考 [geoJson数据交互](https://www.oschina.net/translate/geojson-spec)

```ts
/**
 * 构建一个标准的 geo 数据
 */
async function builGeoJsonCesium() {
    // 模拟点位数据
    const dataJson: any[] = await import('../../mock/stationList1.json');
    // 声明一个标准的 geo 数据
    let GeoJsonHeader: any = {
        type: 'FeatureCollection',
        crs: {
            type: 'name',
            properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
        },
        features: features,
    };
    for (let i = 0; i < dataJson.length; i++) {
        const point = { ...dataJson[i] };
        // 转换经纬度   经度在前，维度在后
        const latitude = parseFloat(dataJson[i].latitude);
        const longitude = parseFloat(dataJson[i].longitude);
        let featureItem = {
            type: 'Feature',
            properties: { ...point },
            geometry: { type: 'Point', coordinates: [longitude, latitude, 0] },
        };
        GeoJsonHeader.features.push(featureItem);
    }
    return GeoJsonHeader;
}
  

/**
* 渲染 geoJson 类型的点位
*/
async function renderEntityMarkerCesium() {
    // 模拟点位数据
    const dataJson: any[] = await import('../../mock/stationList1.json');
    // 构建出一个 geoJson 数据
    const geoJson = await builGeoJsonCesium();
    // 加载 geoJosn 数据到地图， 后续如要移除点位，直接卸载掉 geoJsonResource 即可
    const geoJsonResource = await GeoJsonDataSource.load(geoJson);
    geoJsonMarker = await (window as any).cesiumMap.dataSources.add(geoJsonResource);
    const entities = geoJsonResource.entities.values;
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        entity.billboard = undefined;
        entity.point = new PointGraphics({
            color: Color.RED,
            pixelSize: 10,
        });
    }
    return markerList;
}
```

### mapbox

mapbox 中绘制 Marker 的方式主要有两种，第一种是采用 Marker 方式绘制，第二种是通过加载 geoJson 数据的方式绘制点位，此文章中仅以第二种方案来渲染点位，mapBox 渲染点所需工具函数较多，因此在此处封装成一个工具类。

```ts
// 工具函数
class MapBoxUtil {
    /**
     * 添加数据资源（更新数据资源）
     * @param sourceName<string> 资源名称
     * @param jsonData<GeoJson> 地理数据
     * @param map
     * @param options<Object> （可选参数）
     */
    public async addSourceToMap(sourceName: string, jsonData: any, map: Map, options: Record<string, any> = {}) {
          // 判断地图上是否存在次资源， 不存在的话给地图添加资源，否则通过 setData 更新数据  
          if (!map.getSource(sourceName)) {
              map.addSource(sourceName, { type: 'geojson', data: jsonData, ...options });
          } else {
              const source: AnySourceImpl = map.getSource(sourceName);
              (source as any).setData(jsonData);
          }
    }

    /**
     * 添加图片到地图
     * @param imagesObj {Object} 图片对象
     * @param map {Object} mapBox 地图实例
     */
    public async loadImages(imagesObj: Record<string, any>, map: any) {
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
}
```


```ts
const mapBoxUtil = new MapBoxUtil()
/**
 * 构建出标准的 GeoJson 数据
 * @param dataList
 * @param code
 */
function buildGeoJSONDataMapBox(dataList: any[], code: string) {
    let GeoJsonHeader: any = {
        type: 'FeatureCollection',
        crs: {
            type: 'name',
            properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
        },
        features: features,
    };
    for (let i = 0; i < dataList.length; i++) {
        const point = { ...dataList[i] };
        let lon = parseFloat(point.longitude);
        let lat = parseFloat(point.latitude);
        // TODO 判断存在误差，后期改进
        let coordinates = lon > lat ? [lon, lat, 0] : [lat, lon, 0]; //存在经纬度录反的情况
        // 处理一下point，添加symbolImgName字段，用以匹配图标资源,
        if (code) {
            point['typeCode'] = point.hasOwnProperty('typeCode') ? point.typeCode : code;
            point['symbolImgName'] = 'site5';   // 指定图片的 id
        }
        let featureItem = {
            type: 'Feature',
            properties: { ...point },
            geometry: { type: 'Point', coordinates: coordinates },
        };
        GeoJsonHeader.features.push(featureItem);
    }
    return GeoJsonHeader;
}

/**
* 渲染 Entity 类型的点位
*/
async function renderResourceMarkerMapBox() {
    const dataJson: any[] = await import('../../mock/stationList1.json');
    await mapBoxUtil.loadImages({
        site5: require('../../assets/map/site-5.png'),
    }, (window as any).mapboxMap);
    const sourceId: string = 'test-source';
    let jsonData = buildGeoJSONDataMapBox(dataJson, '1');
    await mapBoxUtil.addSourceToMap(sourceId, jsonData, (window as any).mapboxMap);
    return await mapBoxUtil.renderMarkerLayer(
        {
            id: 'test-layer',     // 图层 id
            type: 'symbol',       // 指定 marker 类型
            source: sourceId,     // 渲染点位所需要的资源
            filter: ['==', 'typeCode', '1'],  // 指定字段
            layout: {
                'icon-image': '{symbolImgName}', //图片的source
                'icon-size': 0.8,
                'icon-ignore-placement': true, //忽略碰撞检测
                visibility: 'visible',
            },
        },
        (window as any).mapboxMap,
    );
}
```

## 最后

此文章对常见的三种 webGis 方案做了简单的使用介绍，从地图的初始化到点位绘制，下一篇文章主要针对三种技术方案下如何实现自定义点位弹框进行介绍，此文章中所有的 gis 效果可通过在线地址进行预览。

笔者是非专业 gis 专业，文章中如有专业性问题错误，欢迎各位大佬指正。

[代码地址](https://github.com/canyuegongzi/simple-gis-web)

[预览地址](http://canyuegongzi.xyz/simple-gis-web/#/)
