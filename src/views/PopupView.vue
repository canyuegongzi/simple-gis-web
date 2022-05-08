<template>
  <div class="view-page-common-container">
    <CommonPopup>
      <template #default>
        <div v-show="mapType === 'LEAFLET'">
          <div class="buttons-container">
<!--            <p class="title">绘制样式(leaflet)</p>-->
<!--            <el-radio-group v-model="status.leaflet.styleType" @change="leafletRender">
              <el-radio :label="1">普通</el-radio>
              <el-radio :label="2">GeoJSON</el-radio>
            </el-radio-group>-->
            <p class="title">操作(leaflet)</p>
            <div class="buttons">
              <el-button type="primary" size="mini" @click="leafletRender">绘制点位</el-button>
              <el-button type="primary" size="mini" @click="tapEvent('CLEAR')">清空</el-button>
              <el-button type="primary" size="mini" @click="resetMap">重置</el-button>
            </div>
          </div>
        </div>
        <div v-show="mapType === 'CESIUM'">
          <div class="buttons-container">
            <p class="title">操作(cesium)</p>
            <div class="buttons">
              <el-button type="primary" size="mini" @click="tapEvent('CLEAR')">清空</el-button>
              <el-button type="primary" size="mini" @click="cesiumRender">绘制</el-button>
              <el-button type="primary" size="mini" @click="resetMap">重置</el-button>
            </div>

          </div>
        </div>
        <div v-show="mapType === 'MAPBOX'">
          <div class="buttons-container">
<!--            <p class="title">绘制样式(mapbox)</p>-->
<!--            <el-radio-group v-model="status.mapbox.styleType" @change="mapboxRender">
              <el-radio :label="1">GeoJSON</el-radio>
            </el-radio-group>-->
            <p class="title">操作(MAPBOX)</p>
            <div class="buttons">
              <el-button type="primary" size="mini" @click="tapEvent('CLEAR')">清空</el-button>
              <el-button type="primary" size="mini" @click="mapboxRender">绘制</el-button>
              <el-button type="primary" size="mini" @click="resetMap">重置</el-button>
            </div>

          </div>
        </div>
      </template>

    </CommonPopup>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeUnmount, reactive, createApp } from "vue";
import CommonPopup from "../components/popup/CommonPopup.vue";
import { Popup as LeafletPopup } from 'leaflet';
import {useStore} from "vuex";
import site from "../assets/map/site-blue.svg"
import site5 from "../assets/map/site-5-svg.svg"
import { ScreenSpaceEventHandler, ScreenSpaceEventType } from "cesium";
import MapPopupView from "../components/popup/MapPopupView.vue";
import {CesiumCustomPopUp} from "../map/service/cesium/widgets/CesiumCustomPopUp";
import {Popup} from "mapbox-gl";
// 地图图层管理
const mapLayer: any = {
  drawEntityCesium: null,  // cesium 线断实体
  geoJsonCoverCesium: null,
  geoJsonCoverMapBox: null,
  polygonLeaflet: null,
  coverLeafletGeoJson: null
};
let leafletMapLayer: any = {
  leafletPopUp: null,
  leafletMarker: null,
  cesiumEntityListLayer: [],
  handlerCesium: null,
  popUpWindowCesium: null,
  resourceLayerMapBox: null,
  glPopupMapbox: null,
}

export default defineComponent({
  name: 'PopupView',
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
     * 删除leaflet marker
     */
    const deleteMarkerLeaflet = () => {
      if (leafletMapLayer.leafletMarker && window?.leafletMapService.map.hasLayer(leafletMapLayer.leafletMarker)) {
        window?.leafletMapService.map.removeLayer(leafletMapLayer.leafletMarker);
        leafletMapLayer.leafletMarker = null
      }
      removePopupLeaflet();
    }

    /**
     * 删除leaflet popup
     */
    const removePopupLeaflet = () => {
      if (leafletMapLayer.leafletPopUp && leafletMapLayer.leafletPopUp.isOpen()) {
        leafletMapLayer.leafletPopUp.remove();
        leafletMapLayer.leafletPopUp = null;
      }
    }

    /**
     * 移除cesium 彈框
     */
    const closePopUpCesium = () => {
      if (leafletMapLayer.popUpWindowCesium) {
        leafletMapLayer.popUpWindowCesium.destroy();
        leafletMapLayer.popUpWindowCesium = null;
      }
    }

    /**
     * 删除cesium marker
     */
    const deleteMarkerCesium = () => {
      for (let i = 0; i < leafletMapLayer.cesiumEntityListLayer.length; i ++) {
        window.cesiumMapService.map.entities.remove(leafletMapLayer.cesiumEntityListLayer[i])
      }
      leafletMapLayer.cesiumEntityListLayer = []
      closePopUpCesium()
    }

    /**
     * 关闭mapbox弹框
     */
    const closeMapboxPopup = () => {
      if (mapLayer.glPopupMapbox) {
        mapLayer.glPopupMapbox.remove();
        mapLayer.glPopupMapbox = null;
      }
    }
    /**
     * 移除mapbox marker
     */
    const removeMapboxMarker = () => {
      closeMapboxPopup();
      if (mapLayer.resourceLayerMapBox && window.mapboxMapService.map.getLayer(mapLayer.resourceLayerMapBox)) {
        // 移除掉图层点击事件
        window.mapboxMapService.map.off('click', mapLayer.resourceLayerMapBox, mapboxClickEventHandler);
        window.mapboxMapService.showOrHideMapLayerById(mapLayer.resourceLayerMapBox, 'hide');
      }

    }

    const mapboxClickEventHandler = (e: any) => {
      let coordinates = e.features[0].geometry.coordinates.slice(); //图标的经纬度
      const dom = document.createElement('div')
      let windowVm = createApp(MapPopupView, { info: { name: e.features[0].properties.name }, closePopUp: closeMapboxPopup }).mount(dom);
      closeMapboxPopup();
      mapLayer.glPopupMapbox = new Popup({
        className: 'blue-popup',
        closeOnClick: true,
        closeButton: false,
        offset: [0, 0],
      }).setLngLat(coordinates).setDOMContent(windowVm.$el).setMaxWidth('none').addTo(window.mapboxMapService.map);
      // @ts-ignore
      window.mapboxMapService.map.easeTo({center: [coordinates[0], coordinates[1]], speed: 0.6, curve: 1.0});
    }

    const addListerEventMapbox = (layerId: string) => {
      window.mapboxMapService.map.on('click', layerId, mapboxClickEventHandler);
    }

    const initMapEventHandlerCesium = () => {
      leafletMapLayer.handlerCesium = new ScreenSpaceEventHandler(window.cesiumMapService.map.scene.canvas);
      leafletMapLayer.handlerCesium.setInputAction((click: any) =>  {
        const pick = window.cesiumMapService.map.scene.pick(click.position);
        openPopUpCesium(pick, click.position);
      }, ScreenSpaceEventType.LEFT_CLICK);
    }
    const openPopUpCesium = (info: any, position: any) => {
      const entity: any = JSON.parse(info.id.description._value);
      closePopUpCesium();
      const dom = document.createElement('div')
      let windowVm = createApp(MapPopupView, { info: entity, closePopUp: closePopUpCesium }).mount(dom);

      window.cesiumMapService.map.flyTo(info.id).then(res => {
        leafletMapLayer.popUpWindowCesium = new CesiumCustomPopUp({
          viewer: window.cesiumMapService.map,
          $sel: windowVm.$el,
          position: info.id._position._value
        });
      });
    }

    const renderNormalIconMarkerLeaflet = async () => {
      let dataJson: any = await import('../mock/popUp/stationList1.json');
      dataJson = dataJson.default;
      const markerList: any[] = [];
      for (let i = 0; i < dataJson.length; i++) {
        const latitude = parseFloat(dataJson[i].latitude);
        const longitude = parseFloat(dataJson[i].longitude);
        const icon = window?.leafletMapService.createIcon({
          iconUrl: site
        });
        const options = {
          icon: icon,
          description: JSON.stringify(dataJson[i])
        }
        const marker = window?.leafletMapService.createMarker([latitude, longitude], options);
        marker.addEventListener('click', (e: any) => {
          const data: any = JSON.parse(e.sourceTarget.options.description);
          const dom = document.createElement('div')
          let windowVm = createApp(MapPopupView, { info: data, closePopUp: removePopupLeaflet }).mount(dom);
          leafletMapLayer.leafletPopUp = new LeafletPopup().setLatLng(e.latlng).setContent(windowVm.$el).openOn(window?.leafletMapService.map);
          window?.leafletMapService.map.flyTo(e.latlng);
        });
        markerList.push(marker);
      }
      return markerList;
    }
    /**
     * leaflet 渲染点位
     */
    const leafletRender = async () => {
      deleteMarkerLeaflet()
      const markerList: any[] = await renderNormalIconMarkerLeaflet();
      leafletMapLayer.leafletMarker = window?.leafletMapService.renderMarkerToGroupLayer(markerList);
      window?.leafletMapService.map.flyTo([
        30.276858411864904,
        120.16433715820311,
      ], 9);
    }
    /**
     * cesium 渲染
     */
    const cesiumRender = async () => {
      if (!leafletMapLayer.handlerCesium) {
        initMapEventHandlerCesium();
      }
      let dataJson: any = await import('../mock/popUp/stationList1.json');
      dataJson = dataJson.default
      deleteMarkerCesium()
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
      leafletMapLayer.cesiumEntityListLayer = markerList;
      return markerList;
    }
    /**
     * 构建geojson数据
     */
    const buildGeoJSONDataMapBox = (dataList: any[], code: string) =>  {
      let GeoJsonHeader: any = {
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
        },
        features: [],
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
    /**
     * mapbox渲染
     */
    const mapboxRender = async () => {
      let dataJson: any = await import('../mock/popUp/stationList1.json');
      dataJson = dataJson.default;
      await window.mapboxMapService.loadImages({ site5: site5 });
      const sourceId: string = 'test-source';
      let jsonData = buildGeoJSONDataMapBox(dataJson, '1');
      await window.mapboxMapService.addSourceToMap(sourceId, jsonData);
      mapLayer.resourceLayerMapBox = await window.mapboxMapService.renderMarkerLayer(
          {
            id: 'test-layer1',
            type: 'symbol',
            source: sourceId,
            filter: ['==', 'typeCode', '1'],
            layout: {
              'icon-image': '{symbolImgName}', //图片的source
              'icon-size': 1.2,
              'icon-ignore-placement': true, //忽略碰撞检测
              visibility: 'visible',
            },
          }
      );
      if (mapLayer.resourceLayerMapBox) {
        addListerEventMapbox(mapLayer.resourceLayerMapBox);
      }
      // @ts-ignore
      window.mapboxMapService.map.easeTo({center: [119.789778, 29.955361], speed: 0.6, curve: 1.0});
    }

    const clearLeaflet = () => {
      deleteMarkerLeaflet();
    }
    const clearCesium = () => {
      deleteMarkerCesium()
    }
    const clearMapbox = () => {
      removeMapboxMarker()
    }

    const tapEvent = (type: string) => {
      if (type === 'CLEAR') {
        if (mapType.value === 'LEAFLET') {
          deleteMarkerLeaflet()
        }
        if (mapType.value === 'CESIUM') {
          deleteMarkerCesium()
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
<style lang="stylus">
.leaflet-popup-close-button
  display none
</style>
