<template>
  <div class="view-page-common-container">
    <CommonPopup>
      <template #default>
        <div v-show="mapType === 'LEAFLET'">
          <div class="buttons-container">
            <p class="title">点位类型(leaflet)</p>
            <el-radio-group v-model="status.leaflet.markerType">
              <el-radio :label="1">普通</el-radio>
              <el-radio :label="2">聚合</el-radio>
            </el-radio-group>
            <p class="title">点位样式(leaflet)</p>
            <el-radio-group v-model="status.leaflet.styleType" @change="leafletRender">
              <el-radio :label="1">Icon</el-radio>
              <el-radio :label="2">divIcon</el-radio>
              <el-radio :label="3">CircleMarker</el-radio>
            </el-radio-group>
            <p class="title">操作(leaflet)</p>
            <div class="buttons">
              <el-button type="primary" @click="tapEvent('CLEAR')">清空</el-button>
              <el-button type="primary" @click="leafletRender">绘制</el-button>
            </div>
          </div>
        </div>
        <div v-show="mapType === 'CESIUM'">
          <div class="buttons-container">
            <p class="title">点位类型(cesium)</p>
            <el-radio-group v-model="status.cesium.markerType">
              <el-radio :label="1">普通</el-radio>
              <el-radio :label="2">聚合</el-radio>
            </el-radio-group>
            <p class="title">点位样式(cesium)</p>
            <el-radio-group v-model="status.cesium.styleType" @change="cesiumRender">
              <el-radio :label="1">图层渲染</el-radio>
              <el-radio :label="2">PrimitiveCollection</el-radio>
              <el-radio :label="3">GeoJSON</el-radio>
            </el-radio-group>
            <p class="title">操作(cesium)</p>
            <div class="buttons">
              <el-button type="primary" @click="tapEvent('CLEAR')">清空</el-button>
              <el-button type="primary" @click="cesiumRender">绘制</el-button>
              <el-button type="primary" @click="resetMap">重置</el-button>
            </div>

          </div>
        </div>
        <div v-show="mapType === 'MAPBOX'">
          <div class="buttons-container">
            <p class="title">点位类型(mapbox)</p>
            <el-radio-group v-model="status.mapbox.markerType">
              <el-radio :label="1">普通</el-radio>
              <el-radio :label="2">聚合</el-radio>
            </el-radio-group>
            <p class="title">点位样式(mapbox)</p>
            <el-radio-group v-model="status.mapbox.styleType" @change="mapboxRender">
              <el-radio :label="1">图层渲染</el-radio>
              <el-radio :label="2">GeoJSON</el-radio>
            </el-radio-group>
            <p class="title">操作(cesium)</p>
            <div class="buttons">
              <el-button type="primary" @click="tapEvent('CLEAR')">清空</el-button>
              <el-button type="primary" @click="mapboxRender">绘制</el-button>
              <el-button type="primary" @click="resetMap">重置</el-button>
            </div>

          </div>
        </div>
      </template>

    </CommonPopup>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeUnmount, reactive} from "vue";
import CommonPopup from "../components/popup/CommonPopup.vue";
import {useStore} from "vuex";
import site from "../assets/map/site-blue.svg"
import site5 from "../assets/map/site-5-svg.svg"
import {Color, GeoJsonDataSource, PointGraphics, PointPrimitiveCollection} from "cesium";
import {CesiumClusterWidgets} from "../map/service/cesium/widgets/CesiumClusterWidgets";
// leaflet icon 点位图层
let leafletNormalIconLayer: any = null;
// icon 聚合图层
let leafletNormalIconClusterLayer: any = null;
// leaflet divicon 点位图层
let leafletNormalDivIconLayer: any = null;
// divicon 据胡润
let leafletNormalDivIconClusterLayer: any = null;
// 小圆点图标
let leafletNormalCircleIconLayer: any = null;
// 小圆点聚合
let leafletNormalCircleIconClusterLayer: any = null;
// cesium 实体集合
let cesiumEntityListLayer: any = [] // markerList
// cesium  Primitives
let pointPrimitives: any = null // Primitives
// geoJsonMarker
let geoJsonMarker: any = null // Primitives
// 聚合系统
let cesiumClusterWidgets: any = null
// mapbox 图层
let normalLayerMarkersMapBox: any = [];
// mapbox 资源图层
let layerIdMapbox: any = '';
let clusterLayerMapBox: any = '';
export default defineComponent({
  name: 'PointView',
  setup() {
    let store = useStore();
    const mapType = computed(() => store.getters.mapType)
    const status = reactive({
      leaflet: {
        markerType: 0,
        styleType: 0
      },
      mapbox: {
        markerType: 0,
        styleType: 0
      },
      cesium: {
        markerType: 0,
        styleType: 0
      }
    })
    const resetCesium = () => {
      window.cesiumMapService.resetMap();
    }
    /**
     * leaflet 渲染点位
     */
    const leafletRender = async () => {
      const markerType = status.leaflet.markerType;
      const styleType = status.leaflet.styleType;
      // icon 图层
      if (markerType === 1) {
        let dataJson: any = await import('../mock/stationList1.json');
        dataJson = dataJson.default
        if (styleType === 1) {
          if (leafletNormalIconLayer && window?.leafletMapService.map.hasLayer(leafletNormalIconLayer)) {
            window?.leafletMapService.map.removeLayer(leafletNormalIconLayer);
          }
          leafletNormalIconLayer = null;
          const markerList: any[] = [];
          for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const icon =  window?.leafletMapService.createIcon({
              iconUrl: site,
            });
            const marker: any = window?.leafletMapService.createMarker([latitude, longitude], {
              icon: icon,
            });
            markerList.push(marker);
          }
          leafletNormalIconLayer = window?.leafletMapService.renderMarkerToGroupLayer(markerList);
          return markerList;
        }
        // divicon 图层
        if (styleType === 2) {
          if (leafletNormalDivIconLayer && window?.leafletMapService.map.hasLayer(leafletNormalDivIconLayer)) {
            window?.leafletMapService.map.removeLayer(leafletNormalDivIconLayer);
          }
          leafletNormalDivIconLayer = null;
          const markerList: any[] = [];
          for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const icon =  window?.leafletMapService.createDivIon({
              html: `
                        <div class="leaflet-icon-item">
                          <span>${i}</span>
                        </div>
                      `,
              className: 'leaflet-div-icon',
            });
            const marker: any =  window?.leafletMapService.createMarker([latitude, longitude], {
              icon: icon,
            });
            markerList.push(marker);
          }
          leafletNormalDivIconLayer = window?.leafletMapService.renderMarkerToGroupLayer(markerList);
          return markerList;
        }
        // 小圆点图标
        if (styleType === 3) {
          if (leafletNormalCircleIconLayer && window?.leafletMapService.map.hasLayer(leafletNormalCircleIconLayer)) {
            window?.leafletMapService.map.removeLayer(leafletNormalCircleIconLayer);
          }
          leafletNormalCircleIconLayer = null;
          const markerList: any[] = [];
          for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const marker: any = window?.leafletMapService.createCircleMarker([latitude, longitude], {
              radius: 8,
            });
            markerList.push(marker);
          }
          leafletNormalCircleIconLayer = window?.leafletMapService.renderMarkerToGroupLayer(markerList);
          return
        }
        return
      }
      if (markerType === 2) {
        let dataJson: any = await import('../mock/stationList1.json');
        dataJson = dataJson.default
        if(styleType === 1) {
          if (leafletNormalIconClusterLayer && window?.leafletMapService.map.hasLayer(leafletNormalIconClusterLayer)) {
            window?.leafletMapService.map.removeLayer(leafletNormalIconClusterLayer);
          }
          leafletNormalIconClusterLayer = null;
          const markerList: any[] = [];
          for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const icon =  window?.leafletMapService.createIcon({
              iconUrl: site,
            });
            const marker: any = window?.leafletMapService.createMarker([latitude, longitude], {
              icon: icon,
            });
            markerList.push(marker);
          }
          leafletNormalIconClusterLayer =  window?.leafletMapService.leafletMarkerCluster.createClusterMarker(markerList);
          window?.leafletMapService.map.addLayer(leafletNormalIconClusterLayer);
          return markerList;
        }
        if(styleType === 2) {
          if (leafletNormalDivIconClusterLayer && window?.leafletMapService.map.hasLayer(leafletNormalDivIconClusterLayer)) {
            window?.leafletMapService.map.removeLayer(leafletNormalDivIconClusterLayer);
          }
          leafletNormalDivIconClusterLayer = null;
          const markerList: any[] = [];
          for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const icon =  window?.leafletMapService.createDivIon({
              html: `
                        <div class="leaflet-icon-item">
                          <span>${i}</span>
                        </div>
                      `,
              className: 'leaflet-div-icon',
            });
            const marker: any =  window?.leafletMapService.createMarker([latitude, longitude], {
              icon: icon,
            });
            markerList.push(marker);
          }
          leafletNormalDivIconClusterLayer =  window?.leafletMapService.leafletMarkerCluster.createClusterMarker(markerList);
          window?.leafletMapService.map.addLayer(leafletNormalDivIconClusterLayer);
          return markerList;
        }
        if(styleType === 3) {
          if (leafletNormalCircleIconClusterLayer && window?.leafletMapService.map.hasLayer(leafletNormalCircleIconClusterLayer)) {
            window?.leafletMapService.map.removeLayer(leafletNormalCircleIconClusterLayer);
          }
          leafletNormalCircleIconClusterLayer = null;
          const markerList: any[] = [];
          for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const marker: any = window?.leafletMapService.createCircleMarker([latitude, longitude], {
              radius: 8,
            });
            markerList.push(marker);
          }
          leafletNormalCircleIconClusterLayer =  window?.leafletMapService.leafletMarkerCluster.createClusterMarker(markerList);
          window?.leafletMapService.map.addLayer(leafletNormalCircleIconClusterLayer);
          return
        }
        return
      }
    }
    /**
     * cesium 渲染
     */
    const cesiumRender = async () => {
      const markerType = status.cesium.markerType;
      const styleType = status.cesium.styleType;
      let dataJson: any = await import('../mock/stationList1.json');
      dataJson = dataJson.default
      if (markerType === 1) {
        if (styleType === 1) {
          for (let i = 0; i < cesiumEntityListLayer.length; i ++) {
            window.cesiumMapService.map.entities.remove(cesiumEntityListLayer[i])
          }
          cesiumEntityListLayer = []
          const markerList = [];
          for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const marker = window.cesiumMapService.createMarker({
              name: dataJson[i].name,
              description: JSON.stringify(dataJson[i]),
              position: window.cesiumMapService.getPosition(longitude, latitude),
              billboard: {
                image: site,
                scale: 1,
                // pixelOffset: new Cartesian2(0, -10),
              },
            });
            markerList.push(marker);
            window.cesiumMapService.map.entities.add(marker);
          }
          const latitude = parseFloat(dataJson[0].latitude);
          const longitude = parseFloat(dataJson[0].longitude);
          window.cesiumMapService.map.camera.flyTo({
            destination: window.cesiumMapService.getPosition(longitude, latitude, 1000000),
          });
          cesiumEntityListLayer = markerList;
          return markerList;
        }
        if (styleType === 2) {
          if (pointPrimitives) {
            window.cesiumMapService.map.scene.primitives.remove(pointPrimitives);
            pointPrimitives = undefined;
          }
          pointPrimitives = window.cesiumMapService.map.scene.primitives.add(new PointPrimitiveCollection());
          for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            (pointPrimitives as PointPrimitiveCollection).add({
              pixelSize: 5,
              color: Color['BLUE'],
              outlineColor: Color.BLACK,
              outlineWidth: 0,
              position: window.cesiumMapService.getPosition(longitude, latitude),
            });
          }
          const latitude = parseFloat(dataJson[0].latitude);
          const longitude = parseFloat(dataJson[0].longitude);
          window.cesiumMapService.map.camera.flyTo({
            destination: window.cesiumMapService.getPosition(longitude, latitude, 1000000),
          });
        }
        if (styleType === 3) {
          if (geoJsonMarker) {
            window.cesiumMapService.map.dataSources.remove(geoJsonMarker);
            geoJsonMarker = undefined;
          }
          const geoJson = await buildGeoJsonCesium();
          const geoJsonResource = await GeoJsonDataSource.load(geoJson);
          geoJsonMarker = await window.cesiumMapService.map.dataSources.add(geoJsonResource);
          const entities = geoJsonResource.entities.values;
          for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            entity.billboard = undefined;
            entity.point = new PointGraphics({
              color: Color.RED,
              pixelSize: 10,
            });
          }
          const latitude = parseFloat(dataJson[0].latitude);
          const longitude = parseFloat(dataJson[0].longitude);
          window.cesiumMapService.map.camera.flyTo({
            destination: window.cesiumMapService.getPosition(longitude, latitude, 1000000),
          });
        }
        return
      }
      if (markerType === 2) {
        if (cesiumClusterWidgets) {
          cesiumClusterWidgets.destroy();
          cesiumClusterWidgets = null;
        }
        const geoJson = await buildGeoJsonCesium();
        cesiumClusterWidgets = new CesiumClusterWidgets({
          viewer: window.cesiumMapService.map,
          data: geoJson,
          selectedEntity: (e: any) => {
            console.log('这是marker页面');
            console.log(e);
          },
        });
        const latitude = parseFloat(dataJson[0].latitude);
        const longitude = parseFloat(dataJson[0].longitude);
        window.cesiumMapService.map.camera.flyTo({
          destination: window.cesiumMapService.getPosition(longitude, latitude, 1000000),
        });
        return
      }
    }
    /**
     * mapbox渲染
     */
    const mapboxRender = async () => {
      const markerType = status.mapbox.markerType;
      const styleType = status.mapbox.styleType;
      let dataJson: any = await import('../mock/stationList1.json');
      dataJson = dataJson.default;
      if (markerType === 1) {
        // 普通marker
        if (styleType === 1) {
          for (let i = 0; i < normalLayerMarkersMapBox.length; i++) {
            normalLayerMarkersMapBox[i].remove();
          }
          normalLayerMarkersMapBox = [];
          const markerList: any[] = [];
          for (let i = 0; i < dataJson.length; i++) {
            if (markerList.length > 50) {
              break;
            }
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const marker = window.mapboxMapService.createMarker();
            marker.setLngLat([longitude, latitude]);
            marker.addTo(window.mapboxMapService.map);
            markerList.push(marker);
          }
          normalLayerMarkersMapBox = markerList;

        }
        // geo 资源方式
        if (styleType === 2) {
          if (layerIdMapbox && (window as any).mapboxMap.getLayer(layerIdMapbox)) {
            window.mapboxMapService.map.removeLayer(layerIdMapbox);
          }
          layerIdMapbox = null;
          await window.mapboxMapService.loadImages({
            site5: site5,
          });
          const sourceId: string = 'test-source';
          let jsonData = buildGeoJSONDataMapBox(dataJson, '1');
          await window.mapboxMapService.addSourceToMap(sourceId, jsonData);
          layerIdMapbox =  await window.mapboxMapService.renderMarkerLayer(
              {
                id: 'test-layer',
                type: 'symbol',
                source: sourceId,
                filter: ['==', 'typeCode', '1'],
                layout: {
                  'icon-image': '{symbolImgName}', //图片的source
                  'icon-size': 0.8,
                  'icon-ignore-placement': true, //忽略碰撞检测
                  visibility: 'visible',
                },
              }
          );

        }
      }
      if (markerType === 2) {
        // 清楚聚合图层
        clusterLayerMapBox && window.mapboxMapService.removeClusterLayer(clusterLayerMapBox);
        await window.mapboxMapService.loadImages({
          site5: site5,
        });
        let jsonData = buildGeoJSONDataMapBox(dataJson, '1');
        const { clusterName, layerName } = await window.mapboxMapService.renderClusterMakerLayer({
          jsonData: jsonData,
          clusterName: 'eventLayer_test',
          clusterColor: 'blue',
          getCircleStyle: {
            'circle-radius': 8,
            'circle-color': 'red',
          },
          unClusterLayerStyle: {},
          clusterCountLayerStyle: {},
          // clusterProperties: { sum: ['+', ['get', 'total']] },
          // clusterProperties: { sum: ['+', ['to-number', ['get', 'total']]] },
          layoutText: {
            'text-field': '{point_count}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'icon-ignore-placement': true,
          },
        });

        if (layerName) {
          window.mapboxMapService.clusterMakerClickCallback(clusterName, layerName, clusterMarkerClickFunMapBox);
        }
        if (clusterName) {
          clusterLayerMapBox = clusterName;
        }
        return
      }
    }
    const clusterMarkerClickFunMapBox = (coordinates: any, info: any, clusterName: any) => {
      console.log(info);
    }

    const buildGeoJSONDataMapBox = (dataList: any[], code: string) => {
      let GeoJsonHeader: any = window.mapboxMapService.getCommonGeoJson();
      for (let i = 0; i < dataList.length; i++) {
        const point = { ...dataList[i] };
        let lon = parseFloat(point.longitude);
        let lat = parseFloat(point.latitude);
        // TODO 判断存在误差，后期改进
        let coordinates = lon > lat ? [lon, lat, 0] : [lat, lon, 0]; //存在经纬度录反的情况
        // 处理一下point，添加symbolImgName字段，用以匹配图标资源,
        if (code) {
          point['typeCode'] = point.hasOwnProperty('typeCode') ? point.typeCode : code;
          point['symbolImgName'] = 'site5';
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

    const getCommonGeoJsonCesium = (features = []) => {
      return {
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
        },
        features: features,
      };
    }

    const buildGeoJsonCesium = async () => {
      let dataJson: any = await import('../mock/stationList1.json');
      dataJson = dataJson.default
      let GeoJsonHeader: any = getCommonGeoJsonCesium([]);
      for (let i = 0; i < dataJson.length; i++) {
        const point = { ...dataJson[i] };
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

    const clearLeaflet = () => {
      if (leafletNormalIconLayer && window?.leafletMapService.map.hasLayer(leafletNormalIconLayer)) {
        window?.leafletMapService.map.removeLayer(leafletNormalIconLayer);
      }
      leafletNormalIconLayer = null;
      if (leafletNormalDivIconLayer && window?.leafletMapService.map.hasLayer(leafletNormalDivIconLayer)) {
        window?.leafletMapService.map.removeLayer(leafletNormalDivIconLayer);
      }
      leafletNormalDivIconLayer = null;
      if (leafletNormalCircleIconLayer && window?.leafletMapService.map.hasLayer(leafletNormalCircleIconLayer)) {
        window?.leafletMapService.map.removeLayer(leafletNormalCircleIconLayer);
      }
      leafletNormalCircleIconLayer = null;
      if (leafletNormalIconClusterLayer && window?.leafletMapService.map.hasLayer(leafletNormalIconClusterLayer)) {
        window?.leafletMapService.map.removeLayer(leafletNormalIconClusterLayer);
      }
      leafletNormalIconClusterLayer = null;
      if (leafletNormalDivIconClusterLayer && window?.leafletMapService.map.hasLayer(leafletNormalDivIconClusterLayer)) {
        window?.leafletMapService.map.removeLayer(leafletNormalDivIconClusterLayer);
      }
      leafletNormalDivIconClusterLayer = null;
      if (leafletNormalCircleIconClusterLayer && window?.leafletMapService.map.hasLayer(leafletNormalCircleIconClusterLayer)) {
        window?.leafletMapService.map.removeLayer(leafletNormalCircleIconClusterLayer);
      }
      leafletNormalCircleIconClusterLayer = null;
    }
    const clearCesium = () => {
      // 实体绘制清除
      for (let i = 0; i < cesiumEntityListLayer.length; i ++) {
        window.cesiumMapService.map.entities.remove(cesiumEntityListLayer[i])
      }
      cesiumEntityListLayer = []
      // 方式清除
      if (pointPrimitives) {
        window.cesiumMapService.map.scene.primitives.remove(pointPrimitives);
      }
      pointPrimitives = undefined;
      if (geoJsonMarker) {
        window.cesiumMapService.map.dataSources.remove(geoJsonMarker);
      }
      geoJsonMarker = undefined;
      if (cesiumClusterWidgets) {
        cesiumClusterWidgets.destroy();
      }
      cesiumClusterWidgets = null;
    }
    const clearMapbox = () => {
      for (let i = 0; i < normalLayerMarkersMapBox.length; i++) {
        normalLayerMarkersMapBox[i].remove();
      }
      normalLayerMarkersMapBox = [];
      if (window.mapboxMapService.map.getLayer(layerIdMapbox)) {
        window.mapboxMapService.map.removeLayer(layerIdMapbox);
      }
      layerIdMapbox = null;
      // 清楚聚合图层
      clusterLayerMapBox && window.mapboxMapService.removeClusterLayer(clusterLayerMapBox);
      clusterLayerMapBox = null;
    }
    const tapEvent = (type: string) => {
      if (type === 'CLEAR') {
        if (mapType.value === 'LEAFLET') {
          clearLeaflet()
        }
        if (mapType.value === 'CESIUM') {
          clearCesium()
          window.cesiumMapService.resetMap();
        }
        if (mapType.value === 'MAPBOX') {
          clearMapbox()
        }
      }
    }

    const resetMap = () => {
      if (mapType.value === 'LEAFLET') {
        window.leafletMapService.resetMap();
      }
      if (mapType.value === 'CESIUM') {
        window.cesiumMapService.resetMap();
      }
      if (mapType.value === 'MAPBOX') {
        window.mapboxMapService.resetMap();
      }
    }
    onBeforeUnmount(() => {
      clearLeaflet()
      clearCesium()
      clearMapbox()
      resetMap()
    })
    return {
      leafletRender,
      cesiumRender,
      mapboxRender,
      tapEvent,
      resetMap,
      mapType,
      resetCesium,
      status
    }
  },
  components: {
    CommonPopup
  },
});
</script>

<style scoped lang="stylus">
.title
  font-size: 14px;
  font-weight: 700;
  color: #3c4a54;
  padding-bottom: 16px;
  padding-top: 16px;

.buttons
  display flex
  justify-content: flex-start;
</style>
<style lang="stylus">
.leaflet-icon-item
  width: 28px;
  height: 28px;
  background: green;
  border-radius: 14px;
  line-height: 28px;
  text-align: center;
  color: #ffff;

.leaflet-div-icon
  background transparent;
  width: 0 !important
  height: 0 !important
  border-radius: 14px;
  line-height: 28px;
  text-align: center;
  color: #ffff;
</style>
