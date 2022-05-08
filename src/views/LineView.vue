<template>
  <div class="view-page-common-container">
    <CommonPopup>
      <template #default>
        <div v-show="mapType === 'LEAFLET'">
          <div class="buttons-container">
            <p class="title">绘制样式(leaflet)</p>
            <el-radio-group v-model="status.leaflet.styleType" @change="leafletRender">
              <el-radio :label="1">普通</el-radio>
              <el-radio :label="2">GeoJSON</el-radio>
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
            <p class="title">绘制样式(cesium)</p>
            <el-radio-group v-model="status.cesium.styleType" @change="cesiumRender">
              <el-radio :label="1">entity</el-radio>
              <el-radio :label="2">GeoJSON</el-radio>
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
            <p class="title">绘制样式(mapbox)</p>
            <el-radio-group v-model="status.mapbox.styleType" @change="mapboxRender">
              <el-radio :label="1">GeoJSON</el-radio>
            </el-radio-group>
            <p class="title">操作(MAPBOX)</p>
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
import {
  Cartesian2,
  Cartesian3,
  Color,
  Entity,
  GeoJsonDataSource, HorizontalOrigin,
  LabelStyle,
  PolylineDashMaterialProperty, VerticalOrigin
} from "cesium";
import {geoJSON} from "leaflet";
// mapbox 资源图层
let layerIdMapbox: any = '';
let clusterLayerMapBox: any = '';
// leaflet 线绘制
let leafletPolylineLeaflet: any = null;
let leafletGeoJsonLineLayer: any = null;
let drawEntityCesium: any = null;
let geoJsonLineCesium: any = null;
export default defineComponent({
  name: 'LineView',
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
    const buildLeafletLineData = async () => {
      let dataJson: any = await import('../mock/line/stationList1.json');
      dataJson = dataJson.default
      const data: any = [];
      for (let i = 0; i < dataJson.length; i++) {
        const latitude = parseFloat(dataJson[i].latitude);
        const longitude = parseFloat(dataJson[i].longitude);
        data.push([latitude, longitude]);
      }
      return { data, position: data[3] };
    }

    const buildGeoJsonMapbox = async () => {
      let dataJson: any = await import('../mock/line/stationList1.json');
      dataJson = dataJson.default
      let GeoJsonHeader: any = await getCommonGeoJsonCesium([]);
      let featureItem: any = {
        type: 'Feature',
        properties: { id: 'test-line' },
        geometry: {
          type: "LineString",
          coordinates: []
        },
      };
      for (let i = 0; i < dataJson.length; i++) {
        const latitude = parseFloat(dataJson[i].latitude);
        const longitude = parseFloat(dataJson[i].longitude);
        featureItem.geometry.coordinates.push([longitude, latitude]);
      }
      GeoJsonHeader.features.push(featureItem);
      return { geoJson: GeoJsonHeader, position: featureItem.geometry.coordinates[0] };
    }
    /**
     * leaflet 渲染点位
     */
    const leafletRender = async () => {
      const styleType = status.leaflet.styleType;
      if (styleType === 1) {
        if (leafletPolylineLeaflet && window?.leafletMapService.map.hasLayer(leafletPolylineLeaflet)) {
          window?.leafletMapService.map.removeLayer(leafletPolylineLeaflet);
        }
        leafletPolylineLeaflet = null;
        const { data, position } = await buildLeafletLineData();
        leafletPolylineLeaflet = window?.leafletMapService.createPolyline(data, {color: 'red'})
            .addTo(window?.leafletMapService.map);
        window?.leafletMapService.map.setView(position, 11);
      }
      // divicon 图层
      if (styleType === 2) {
        if (leafletGeoJsonLineLayer && window?.leafletMapService.map.hasLayer(leafletGeoJsonLineLayer)) {
          window?.leafletMapService.map.removeLayer(leafletGeoJsonLineLayer);
        }
        leafletGeoJsonLineLayer = null
        let dataJson1: any = await import('../mock/line/geoJsonline.json');
        dataJson1 = dataJson1.default
        leafletGeoJsonLineLayer = geoJSON(dataJson1, {
          style: {
            color: 'red'
          }
        }).addTo(window.leafletMapService.map);
        window?.leafletMapService.map.flyTo([
          30.276858411864904,
          120.16433715820311,
        ], 11);
      }
    }
    /**
     * cesium 渲染
     */
    const cesiumRender = async () => {
      const styleType = status.cesium.styleType;
      if (styleType === 1) {
        let dataJson: any = await import('../mock/line/stationList1.json');
        dataJson = dataJson.default;
        if (drawEntityCesium) {
          window.cesiumMapService.map.entities.remove(drawEntityCesium);
          drawEntityCesium = null;
        }
        const positionList: number[] = [];
        for (let i = 0; i < dataJson.length; i++) {
          const latitude = parseFloat(dataJson[i].latitude);
          const longitude = parseFloat(dataJson[i].longitude);
          // const position = Cartesian3.fromDegrees(longitude, latitude);
          positionList.push(longitude);
          positionList.push(latitude);
        }
        const drawEntity: Entity = new Entity({
          polyline: {
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
            text: '超完美线条',  //文本
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
        window.cesiumMapService.map.entities.add(drawEntity);
        await window.cesiumMapService.map.flyTo(drawEntity);
        drawEntityCesium = drawEntity;
        return drawEntity;
      }
      if (styleType === 2) {
        if (geoJsonLineCesium) {
          window.cesiumMapService.map.dataSources.remove(geoJsonLineCesium);
          geoJsonLineCesium = null;
        }
        const geoJson = await buildGeoJsonCesium();
        const geoJsonResource = await GeoJsonDataSource.load(geoJson);
        geoJsonLineCesium = await window.cesiumMapService.map.dataSources.add(geoJsonResource);
        const entities = geoJsonResource.entities.values;
        for (let i = 0; i < entities.length; i++) {
          const entity = entities[i];
          entity.billboard = undefined;
          (entity as any).nameID  = `${i}-test-line`;
          (entity as any).polyline.width = 2;
          (entity as any).polyline.material = new PolylineDashMaterialProperty({
            color: Color.RED,
          });
        }
        await window.cesiumMapService.map.flyTo(entities[0]);
      }
    }
    /**
     * mapbox渲染
     */
    const mapboxRender = async () => {
      const styleType = status.mapbox.styleType;
      if (styleType === 1) {
        if (window.mapboxMapService.map &&window.mapboxMapService.map.getLayer('test-line-mapbox')) {
          window.mapboxMapService.map.removeLayer('test-line-mapbox');
          window.mapboxMapService.map.removeSource('test-line-mapbox');
        }
        const { geoJson, position } = await buildGeoJsonMapbox();
        console.log(geoJson, position)
        window.mapboxMapService.map.addSource('test-line-mapbox',{
          "type": "geojson",
          "data": geoJson
        });
        window.mapboxMapService.map.addLayer({
          "id": "test-line-mapbox",
          "type": "line",
          "source": 'test-line-mapbox',
          "layout": {
            "line-cap": "round",
            //"line-json": "round"
          },
          "paint": {
            "line-color": "red",
            "line-width": 6,
            "line-opacity": 0.5
          }
        });
        window.mapboxMapService.map.flyTo({
          center: position,
          zoom: 9,
          speed: 0.6,
          curve: 1,
          easing(t: any) {
            return t;
          }
        });

      }
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
      let dataJson: any = await import('../mock/line/stationList1.json');
      dataJson = dataJson.default
      let GeoJsonHeader: any = await getCommonGeoJsonCesium([]);
      let featureItem: any = {
        type: 'Feature',
        properties: { id: 'test-line' },
        geometry: {
          type: "LineString",
          coordinates: []
        },
      };
      for (let i = 0; i < dataJson.length; i++) {
        const latitude = parseFloat(dataJson[i].latitude);
        const longitude = parseFloat(dataJson[i].longitude);
        featureItem.geometry.coordinates.push([longitude, latitude, 0]);
      }
      GeoJsonHeader.features.push(featureItem);
      return GeoJsonHeader;
    }

    const clearLeaflet = () => {
      if (leafletPolylineLeaflet && window?.leafletMapService.map.hasLayer(leafletPolylineLeaflet)) {
        window?.leafletMapService.map.removeLayer(leafletPolylineLeaflet);
      }
      if (leafletGeoJsonLineLayer && window?.leafletMapService.map.hasLayer(leafletGeoJsonLineLayer)) {
        window?.leafletMapService.map.removeLayer(leafletGeoJsonLineLayer);
      }
      leafletGeoJsonLineLayer = null;
      leafletPolylineLeaflet = null;
    }
    const clearCesium = () => {
      if (drawEntityCesium) {
        window.cesiumMapService.map.entities.remove(drawEntityCesium);
        drawEntityCesium = null;
      }
      if (geoJsonLineCesium) {
        window.cesiumMapService.map.dataSources.remove(geoJsonLineCesium);
        geoJsonLineCesium = null;
      }
    }
    const clearMapbox = () => {
      if (window.mapboxMapService.map && window.mapboxMapService.map.getLayer('test-line-mapbox')) {
        window.mapboxMapService.map.removeLayer('test-line-mapbox');
        window.mapboxMapService.map.removeSource('test-line-mapbox');
      }
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
