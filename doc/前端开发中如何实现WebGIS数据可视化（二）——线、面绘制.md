## 前言

在上一篇文章 [地图创建、点位绘制](https://juejin.cn/post/6985900607588532260) 中详细讲解了 leaflet、 cesium、mapbox 中如何创建地图、绘制点位。在 webGis 开发中遇到需要渲染某个区划、某条河、某条路径的需求时，除了传统的发布 gis 图层之外，也可以直接用数据在客户端绘制线、面要素。这种基于上篇文章的基础，这一篇文章来聊聊这三种地图中如何绘制线要素和面要素。

通过这篇文章，能够有这些收获：

- 在 leaflet、cesium、mapBox 通过不同方式绘制 线要素
- 在 leaflet、cesium、mapBox 通过不同方式绘制 面要素

文章中相关代码均已提交到 github，欢迎 star。

[代码地址](https://github.com/canyuegongzi/simple-gis-web)

[预览地址](http://canyuegongzi.xyz/simple-gis-web/#/)

## 线要素

leaflet、cesium、mapbox 在数据管理方式上略有差异，但渲染方式基本是类似的，第一种就是较为常见的通过经纬度集合直接在地图上绘制，另一种就是通过标准的 geoJson 数据格式绘制，针对三种地图如何绘制线要素接下来逐步讲解。

### leaflet

#### 普通数据

针对实例代码中出现的 stationList1.json 文件可参考 [模拟数据](https://github.com/canyuegongzi/simple-gis-web/blob/master/src/mock/line/stationList1.json)

```ts
const layer = {
    polylineLeaflet: null
}

/**
 * 构建经纬度集合
 */
async function buildLeafletLineData() {
    const dataJson: any[] = await import('stationList1.json');
    const data: any = [];
    // 模拟数据 处理成经纬度的集合
    for (let i = 0; i < dataJson.length; i++) {
        // leaflet 特殊 数组第一位为维度  第二位为经度
        const latitude = parseFloat(dataJson[i].latitude);
        const longitude = parseFloat(dataJson[i].longitude);
        data.push([latitude, longitude]);
    }
    return { data, position: data[3] };
}
/**
 * 渲染 leaflet 线要素
 */
async function renderEntityLineLeaflet() {
    // 根据数据模处理成经纬度集合
    const { data, position } = await buildLeafletLineData();
    // 创建 Polyline 的实例 然后把该图层追加到地图上
    layer.polylineLeaflet = new Polyline(data, { color: 'red' })
        .addTo((window as any).leafletMap);
    // 此处的 (window as any).leafletMap 地图实例在上一篇中已经详细介绍过不再做介绍
    (window as any).leafletMap.setView(position, 11);
}
```

其中创建线元素主要通过  ```new Polyline()``` 操作，其中第一个属性为 经纬度集合，第二个参数类型见 leaflet 中 index.d.ts 中 PolylineOptions 描述，主要包括一下属性：

```ts
export interface PathOptions extends InteractiveLayerOptions {
    stroke?: boolean;
    color?: string;
    weight?: number;
    opacity?: number;
    lineCap?: LineCapShape;
    lineJoin?: LineJoinShape;
    dashArray?: string | number[];
    dashOffset?: string;
    fill?: boolean;
    fillColor?: string;
    fillOpacity?: number;
    fillRule?: FillRule;
    renderer?: Renderer;
    className?: string;
    smoothFactor?: number;
    noClip?: boolean;
}
```

其中属性都非常通俗易懂，线的宽度、是否填充、颜色、填充色、透明度等。

#### geoJson

针对实例代码中出现的 geoJsonline.json 文件可 [自行在线绘制geoJson](http://geojson.io/#map=11/30.2386/120.3545) 。

```ts
const layer = {
    polylineLeafletGeoJson: null
}

/**
 * 加载 geoJson 线数据
 */
async function renderGeoLineLeaflet() {
    const dataJson1: any = require('geoJsonline.json');
    layer.polylineLeafletGeoJson = geoJSON(dataJson1, {
        style: {
            color: 'red'
        }
    })
        .addTo((window as any).leafletMap);
    (window as any).leafletMap.flyTo([
        30.276858411864904,
        120.16433715820311,
    ], 11);
}
```

其中主要调用 geoJSON 方法，第一个参数为标准的 geoJson 数据；第二个为要素的配置信息，如线的颜色、宽度等，和之前 PathOptions 的属性相同。

### cesium

cesium 中的任何要素均可以通过实体的方式被创建，因此绘制线要素的第一种方案就是通过实体的方式，另一种是通过加载 geoJson 数据的方式创建。

#### 普通实体

针对实例代码中出现的 stationList1.json 文件可参考 [模拟数据](https://github.com/canyuegongzi/simple-gis-web/blob/master/src/mock/line/stationList1.json)

```ts
async function renderEntityLineCesium() {
    const positionList: number[] = [];
    // 通过模拟数据梳理出经纬度的集合   经度、维度、经度、维度
    const dataJson: any[] = await import('stationList1.json');
    for (let i = 0; i < dataJson.length; i++) {
        const latitude = parseFloat(dataJson[i].latitude);
        const longitude = parseFloat(dataJson[i].longitude);
        positionList.push(longitude);
        positionList.push(latitude);
    }
    // 此处创建实体 需要注意的是 positions的数据需要
    const drawEntity: Entity = new Entity({
        polyline: {
            // 由给定的经纬度集合数组生成一个C3数组并返回
            positions: Cartesian3.fromDegreesArray(positionList),
            width: 2,
            material: Color.BLUE,  // 线条材质
            // material: new PolylineDashMaterialProperty({
            //     color: Color.RED,
            // }),
            // depthFailMaterial: new PolylineDashMaterialProperty({
            //     color: Color.YELLOW,
            // }),
            // followSurface: false, //取消弯曲
            // clampToGround: true

        },
        label: {
            text: '线条',  //文本
            show: true,  // 默认显示
            font: '12pt Source Han Sans CN',    //字体样式
            fillColor: Color.GOLD,        //字体颜色
            backgroundColor: Color.AQUA,    //背景颜色
            //showBackground:true,                //是否显示背景颜色
            style: LabelStyle.FILL,        //label样式
            outlineWidth: 1,
            verticalOrigin: VerticalOrigin.CENTER,//垂直位置
            horizontalOrigin: HorizontalOrigin.LEFT,//水平位置
            pixelOffset: new Cartesian2(5, 0)            //偏移
        }
    });
    // 把创建好的线实体添加到 cesium 的 实体集合中
    (window as any).cesiumMap.entities.add(drawEntity);
    // 地图通过 flyTo 的方式定位到 该线实体
    (window as any).cesiumMap.flyTo(drawEntity);
    // 暂时缓存该实体，方便后期移除实体
    (cesiumLayer as any).drawEntityCesium = drawEntity;
    return drawEntity;
}
```

通过实体的方式绘制线要素的 ```new Entity()``` 操作，主要通过 polyline 配置项，其类型为 ```PolylineGraphics | PolylineGraphics.ConstructorOptions```，其中配置项较多，建议直接阅读 cesium 的类型声明文档。

```ts
export namespace PolylineGraphics {
    type ConstructorOptions = {
        show?: Property | boolean;
        positions?: Property | Cartesian3[];
        width?: Property | number;
        granularity?: Property | number;
        material?: MaterialProperty | Color;
        depthFailMaterial?: MaterialProperty | Color;
        arcType?: Property | ArcType;
        clampToGround?: Property | boolean;
        shadows?: Property | ShadowMode;
        distanceDisplayCondition?: Property | DistanceDisplayCondition;
        classificationType?: Property | ClassificationType;
        zIndex?: Property | number;
    };
}
```

#### geoJson

cesium 通过geoJson 绘制线要素也是非常简单的，针对实例代码中出现的 geoJsonline.json 文件可 [自行在线绘制geoJson](http://geojson.io/#map=11/30.2386/120.3545) ,代码示例如下：

```ts
async function renderGeoLineCesium() {
        // 加载 geoJosn
        const geoJson: any = require('geoJsonline.json');
        // cesium 提供了 GeoJsonDataSource.load 方式加载标准的 geoJosn 数据
        const geoJsonResource = await GeoJsonDataSource.load(geoJson);
        // 把 geoJosn 数据资源添加到地图中
        cesiumLayer.geoJsonLineCesium = await (window as any).cesiumMap.dataSources.add(geoJsonResource);
        // 获取 geoJosn 中包含的实体 
        const entities = geoJsonResource.entities.values;
        // 对每个实体进行重构
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            entity.billboard = undefined;
            // 以下代码为重构线要素的样式
            (entity as any).nameID  = `${i}-test-line`;
            (entity as any).polyline.width = 2;
            (entity as any).polyline.material = new PolylineDashMaterialProperty({
                color: Color.RED,
            });
        }
        // 地图飞行定位到实体
        (window as any).cesiumMap.flyTo(entities[0]);
}
```

### mapbox

```ts
async function renderGeoLineMapBox() {
      // 加载 geoJosn
      const geoJson: any = import('geoJsonline.json')
      // mapbox 添加 geoJosn 资源，需要指定资源的 id 标识，方便后期绘制其他图层时指定该资源或者是移除该资源    
      (window as any).mapboxMap.addSource('test-line-mapbox',{
          "type": "geojson",
          "data": geoJson
      });
      // 添加图层 ，指定数据源为刚加载的资源
      (window as any).mapboxMap.addLayer({
          "id": "test-line-mapbox",    // 图层 id
          "type": "line",              // 图层类型
          "source": 'test-line-mapbox',// 资源标识 id
          "layout": {                  // 通用的一些布局配置
              "line-cap": "round",
              //"line-json": "round"
          },
          "paint": {                   // 线要素样式  颜色、宽度、透明度等
              "line-color": "red",
              "line-width": 6,
              "line-opacity": 0.5
          }
      });
      // 地图定位到该线要素（中心点只是简单的获取了线要素的第一个点）
      (window as any).mapboxMap.flyTo({
          center: geoJson.features[0].geometry.coordinates[0],
          zoom: 9,
          speed: 0.6,
          curve: 1,
          easing(t: any) {
              return t;
          }
      });
}
```

mapBox 绘制线要素，先要通过 addSource 方式添加数据到地图中，然后再通过 addLayer 的方式绘制图层，具体的一些配置项在此不作详细列举，有需要可以直接查看类型声明文档。

## 面要素

之前讲解了三种地图中如何绘制线要素，面要素的绘制除了一些配置项有略微差别之外其余的和线的绘制基本相同。

### leaflet

leaflet面要素的绘制和线要素基本相同，既可以通过实例化对应的 Api 来绘制，也可以加载 geoJson 来绘制。

#### 普通数据

针对实例代码中出现的 stationList1.json 文件可参考 [模拟数据](https://github.com/canyuegongzi/simple-gis-web/blob/master/src/mock/line/stationList1.json)

```ts
const layer = {
    polygonLeaflet: null
}

/**
 * 构建经纬度集合
 */
async function buildLeafletPolygonData() {
    const dataJson: any[] = await import('stationList1.json');
    const data: any = [];
    // 模拟数据 处理成经纬度的集合
    for (let i = 0; i < dataJson.length; i++) {
        // leaflet 特殊 数组第一位为维度  第二位为经度
        const latitude = parseFloat(dataJson[i].latitude);
        const longitude = parseFloat(dataJson[i].longitude);
        data.push([latitude, longitude]);
    }
    return { data, position: data[3] };
}
/**
 * 渲染 leaflet 面要素
 */
async function renderEntityPolygonLeaflet() {
    // 根据数据模处理成经纬度集合
    const { data, position } = await buildLeafletPolygonData();
    // 创建 Polygon 的实例 然后把该图层追加到地图上
    layer.polygonLeaflet = new Polygon(data, { color: '#000eff',fillColor: '#0000ed', weight: 1 })
        .addTo((window as any).leafletMap);
    // 此处的 (window as any).leafletMap 地图实例在上一篇中已经详细介绍过不再做介绍
    (window as any).leafletMap.setView(position, 11);
}
```

其中创建线元素主要通过  ```new Polygon()``` 操作，其中第一个属性为 经纬度集合，第二个参数类型见 leaflet 中 index.d.ts 中 PolylineOptions 描述（线、面的配置项并无差别），主要包括一下属性：

```ts
export interface PathOptions extends InteractiveLayerOptions {
    stroke?: boolean;
    color?: string;
    weight?: number;
    opacity?: number;
    lineCap?: LineCapShape;
    lineJoin?: LineJoinShape;
    dashArray?: string | number[];
    dashOffset?: string;
    fill?: boolean;
    fillColor?: string;
    fillOpacity?: number;
    fillRule?: FillRule;
    renderer?: Renderer;
    className?: string;
    smoothFactor?: number;
    noClip?: boolean;
}
```

#### geoJson

针对实例代码中出现的 mockPolygon.json 文件可 [自行在线绘制geoJson](http://geojson.io/#map=11/30.2386/120.3545) 。

```ts
const layer = {
    polygonLeafletGeoJson: null
}

/**
 * 加载 geoJson 面要素
 */
async function renderGeoPolygonLeaflet() {
    const dataJson1: any = await import('mockPolygon.json')
    layer.polygonLeafletGeoJson = geoJSON(dataJson1, {
        style: {
            color: 'red'
        }
    })
        .addTo((window as any).leafletMap);
    (window as any).leafletMap.flyTo([
        30.276858411864904,
        120.16433715820311,
    ], 11);
}
```

其中主要调用 geoJSON 方法，第一个参数为标准的 geoJson 数据；第二个为要素的配置信息，如线的颜色、透明度等，和之前 PathOptions 的属性相同。

### cesium

#### 普通实体

针对实例代码中出现的 stationList1.json 文件可参考 [模拟数据](https://github.com/canyuegongzi/simple-gis-web/blob/master/src/mock/line/stationList1.json)

```ts
async function renderEntityPolygonCesium() {
    const positionList: number[] = [];
    // 通过模拟数据梳理出经纬度的集合   经度、维度、经度、维度
    const dataJson: any[] = await import('stationList1.json');
    for (let i = 0; i < dataJson.length; i++) {
        const latitude = parseFloat(dataJson[i].latitude);
        const longitude = parseFloat(dataJson[i].longitude);
        positionList.push(longitude);
        positionList.push(latitude);
    }
    // 此处创建实体 需要注意的是 positions的数据需要
    const drawEntity: Entity = new Entity({
        name: '面数据',
        polygon: {
            // @ts-ignore
            hierarchy: Cartesian3.fromDegreesArray(positionList),
            outline: false,
            perPositionHeight: true, //允许三角形使用点的高度
            material: Color.RED.withAlpha(0.4)
        },
        label: {
            text: '实体面数据',  //文本
            show: true,  // 默认显示
            font: '12pt Source Han Sans CN',    //字体样式
            fillColor: Color.GOLD,        //字体颜色
            backgroundColor: Color.AQUA,    //背景颜色
            //showBackground:true,                //是否显示背景颜色
            style: LabelStyle.FILL,        //label样式
            outlineWidth: 1,
            verticalOrigin: VerticalOrigin.CENTER,//垂直位置
            horizontalOrigin: HorizontalOrigin.LEFT,//水平位置
            pixelOffset: new Cartesian2(5, 0)            //偏移
        }
    });
    // 把创建好的线实体添加到 cesium 的 实体集合中
    (window as any).cesiumMap.entities.add(drawEntity);
    // 地图通过 flyTo 的方式定位到 该线实体
    (window as any).cesiumMap.flyTo(drawEntity);
    // 暂时缓存该实体，方便后期移除实体
    (cesiumLayer as any).drawEntityCesium = drawEntity;
    return drawEntity;
}
```

通过实体的方式绘制线要素的 ```new Entity()``` 操作，主要通过 polygon 配置项，其类型为 ```PolygonGraphics | PolygonGraphics.ConstructorOptions```，其中配置项较多，建议直接阅读 cesium 的类型声明文档，cesium 的类型文档还是非常贴心的，每一个属性基本都有详细的描述。

```ts
export namespace PolygonGraphics {
    type ConstructorOptions = {
        show?: Property | boolean;
        hierarchy?: Property | PolygonHierarchy;
        height?: Property | number;
        heightReference?: Property | HeightReference;
        extrudedHeight?: Property | number;
        extrudedHeightReference?: Property | HeightReference;
        stRotation?: Property | number;
        granularity?: Property | number;
        fill?: Property | boolean;
        material?: MaterialProperty | Color;
        outline?: Property | boolean;
        outlineColor?: Property | Color;
        outlineWidth?: Property | number;
        perPositionHeight?: Property | boolean;
        closeTop?: boolean | boolean;
        closeBottom?: boolean | boolean;
        arcType?: Property | ArcType;
        shadows?: Property | ShadowMode;
        distanceDisplayCondition?: Property | DistanceDisplayCondition;
        classificationType?: Property | ClassificationType;
        zIndex?: ConstantProperty | number;
    };
}
```

#### geoJson

cesium 通过 geoJson 绘制线要素也是非常简单的，针对实例代码中出现的 mockPolygon.json 文件可 [自行在线绘制geoJson](http://geojson.io/#map=11/30.2386/120.3545) ,代码示例如下：

```ts
const cesiumLayer = {
    geoJsonCoverCesium: null
}
async function renderGeoPolygonCesium() {
        // 加载 geoJosn
        const geoJson: any = require('mockPolygon.json');
        // cesium 提供了 GeoJsonDataSource.load 方式加载标准的 geoJosn 数据
        const geoJsonResource = await GeoJsonDataSource.load(geoJson);
        // 把 geoJosn 数据资源添加到地图中
        cesiumLayer.geoJsonCoverCesium = await (window as any).cesiumMap.dataSources.add(geoJsonResource);
        // 获取面geoJson  中所有的实体
        const entities = geoJsonResource.entities.values;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            entity.billboard = undefined;
            (entity as any).nameID  = `${i}-test-polygon`;
            (entity as any).polygon.perPositionHeight = true; //允许三角形使用点的高度
            (entity as any).polygon.material = Color.RED.withAlpha(0.4);
        }
        (window as any).cesiumMap.flyTo(entities[0]);
}
``` 

### mapbox

```ts
async function renderGeoPolygonMapBox() {
      // 加载 geoJosn
      const geoJson: any = import('mockPolygon.json')
      // mapbox 添加 geoJosn 资源，需要指定资源的 id 标识，方便后期绘制其他图层时指定该资源或者是移除该资源    
      (window as any).mapboxMap.addSource('test-polygon-mapbox',{
          "type": "geojson",
          "data": geoJson
      });
      (window as any).mapboxMap.addLayer({
          "id": "test-polygon-mapbox",
          "type": "fill",
          "source": 'test-polygon-mapbox',
          'layout': {},
          'paint': {
              'fill-color': 'red',
              'fill-opacity': 0.8
          }
      });
      // 地图定位到该线要素（中心点只是简单的获取了线要素的第一个点）
      (window as any).mapboxMap.flyTo({
          center: geoJson.features[0].geometry.coordinates[0],
          zoom: 9,
          speed: 0.6,
          curve: 1,
          easing(t: any) {
              return t;
          }
      });
}
```

mapBox 绘制面要素步骤和线要素的绘制相同，先要通过 addSource 方式添加数据到地图中，然后再通过 addLayer 的方式绘制图层，当需要移除相关的图层时直接调用 removeLayer 即可，如果该图层只是暂时影藏时也可以调用 ```setLayoutProperty(layerName, 'visibility', 'none')```。

## 最后

这篇文章简单粗粗略的讲解了在三种地图中如何通过不同的方式绘制线、面要素。 笔者是非专业 gis 专业出生，文章中如有专业性问题错误，欢迎各位大佬指正。

[前端开发中如何实现WebGIS数据可视化（一）——地图创建、点位绘制](https://juejin.cn/post/6985900607588532260)

[代码地址](https://github.com/canyuegongzi/simple-gis-web)

[预览地址](http://canyuegongzi.xyz/simple-gis-web/#/)
