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
import {
  Cartesian2,
  Cartesian3,
  Color,
  Entity,
  GeoJsonDataSource, HorizontalOrigin,
  LabelStyle,
  VerticalOrigin
} from "cesium";
import {geoJSON} from "leaflet";
// 地图图层管理
const mapLayer: any = {
  drawEntityCesium: null,  // cesium 线断实体
  geoJsonCoverCesium: null,
  geoJsonCoverMapBox: null,
  polygonLeaflet: null,
  coverLeafletGeoJson: null
};
const geoJsonTest: any = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              120.08511543273926,
              30.865762703102323
            ],
            [
              120.09713172912596,
              30.870625105172156
            ],
            [
              120.08708953857422,
              30.86966737881701
            ],
            [
              120.07876396179198,
              30.86627842410542
            ],
            [
              120.07721900939941,
              30.861563157373602
            ],
            [
              120.07842063903809,
              30.855816112502538
            ],
            [
              120.08254051208496,
              30.85087927333077
            ],
            [
              120.0857162475586,
              30.84822653838007
            ],
            [
              120.09507179260254,
              30.848005473822894
            ],
            [
              120.09979248046874,
              30.851026645343705
            ],
            [
              120.09979248046874,
              30.860384304455117
            ],
            [
              120.10133743286133,
              30.86657312057582
            ],
            [
              120.08511543273926,
              30.865762703102323
            ]
          ]
        ]
      }
    }
  ]
};
export default defineComponent({
  name: "CoverView",
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
      return { geoJson: geoJsonTest, position: geoJsonTest.features[0].geometry.coordinates[0] };
    }
    /**
     * leaflet 渲染点位
     */
    const leafletRender = async () => {
      const styleType = status.leaflet.styleType;
      // 普通 Polygon 类型
      if (styleType === 1) {
        if (mapLayer.polygonLeaflet && window?.leafletMapService.map.hasLayer(mapLayer.polygonLeaflet)) {
          window?.leafletMapService.map.removeLayer(mapLayer.polygonLeaflet);
        }
        mapLayer.polygonLeaflet = null;
        const { data, position } = await buildLeafletLineData();
        mapLayer.polygonLeaflet = window?.leafletMapService.createPolygon(data, { color: '#000eff',fillColor: '#0000ed', weight: 1 })
            .addTo(window?.leafletMapService.map);
        window?.leafletMapService.map.setView(position, 11);
      }
      // 普通 geojson
      if (styleType === 2) {
        if (mapLayer.coverLeafletGeoJson && window?.leafletMapService.map.hasLayer(mapLayer.coverLeafletGeoJson)) {
          window?.leafletMapService.map.removeLayer(mapLayer.coverLeafletGeoJson);
        }
        mapLayer.coverLeafletGeoJson = null
        const data: any = await import('../mock/polygon/mockPolygon.json');
        mapLayer.coverLeafletGeoJson = geoJSON(data, {
          style: {
            color: 'red'
          }
        }).addTo(window?.leafletMapService.map);
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
        if (mapLayer.drawEntityCesium) {
          window.cesiumMapService.map.entities.remove(mapLayer.drawEntityCesium);
          mapLayer.drawEntityCesium = null;
        }
        const positionList: number[] = [];
        for (let i = 0; i < dataJson.length; i++) {
          const latitude = parseFloat(dataJson[i].latitude);
          const longitude = parseFloat(dataJson[i].longitude);
          positionList.push(longitude);
          positionList.push(latitude);
        }
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
        window.cesiumMapService.map.entities.add(drawEntity);
        await window.cesiumMapService.map.flyTo(drawEntity);
        mapLayer.drawEntityCesium = drawEntity;
        return drawEntity;
      }
      if (styleType === 2) {
        if (mapLayer.geoJsonCoverCesium) {
          window.cesiumMapService.map.dataSources.remove(mapLayer.geoJsonCoverCesium);
          mapLayer.geoJsonCoverCesium = null;
        }
        const geoJsonResource = await GeoJsonDataSource.load(geoJsonTest);
        mapLayer.geoJsonCoverCesium = await  window.cesiumMapService.map.dataSources.add(geoJsonResource);
        const entities = geoJsonResource.entities.values;
        for (let i = 0; i < entities.length; i++) {
          const entity = entities[i];
          entity.billboard = undefined;
          (entity as any).nameID  = `${i}-test-polygon`;
          (entity as any).polygon.perPositionHeight = true; //允许三角形使用点的高度
          (entity as any).polygon.material = Color.RED.withAlpha(0.4);
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
        if (window.mapboxMapService.map && window.mapboxMapService.map.getLayer('test-polygon-mapbox')) {
          window.mapboxMapService.map.removeLayer('test-polygon-mapbox');
          window.mapboxMapService.map.removeSource('test-polygon-mapbox');
        }
        const { geoJson, position } = await buildGeoJsonMapbox();
        window.mapboxMapService.map.addSource('test-polygon-mapbox',{
          type: "geojson",
          data: geoJson
        });
        window.mapboxMapService.map.addLayer({
          "id": "test-polygon-mapbox",
          "type": "fill",
          "source": 'test-polygon-mapbox',
          'layout': {},
          'paint': {
            'fill-color': 'red',
            'fill-opacity': 0.8
          }
        });
        window.mapboxMapService.map.flyTo({
          center: { lng: position[0][0], lat: position[0][1] },
          zoom: 12,
          speed: 0.6,
          curve: 1,
          easing(t: any) {
            return t;
          }
        });

      }
    }

    const clearLeaflet = () => {
      if (mapLayer.polygonLeaflet && window?.leafletMapService.map.hasLayer(mapLayer.polygonLeaflet)) {
        window?.leafletMapService.map.removeLayer(mapLayer.polygonLeaflet);
      }
      mapLayer.polygonLeaflet = null;
      if (mapLayer.coverLeafletGeoJson && window?.leafletMapService.map.hasLayer(mapLayer.coverLeafletGeoJson)) {
        window?.leafletMapService.map.removeLayer(mapLayer.coverLeafletGeoJson);
      }
      mapLayer.coverLeafletGeoJson = null
    }
    const clearCesium = () => {
      if (mapLayer.drawEntityCesium) {
        window.cesiumMapService.map.entities.remove(mapLayer.drawEntityCesium);
      }
      mapLayer.drawEntityCesium = null;
      if (mapLayer.geoJsonCoverCesium) {
        window.cesiumMapService.map.dataSources.remove(mapLayer.geoJsonCoverCesium);
      }
      mapLayer.geoJsonCoverCesium = null;
    }
    const clearMapbox = () => {
      if (window.mapboxMapService.map && window.mapboxMapService.map.getLayer('test-polygon-mapbox')) {
        window.mapboxMapService.map.removeLayer('test-polygon-mapbox');
        window.mapboxMapService.map.removeSource('test-polygon-mapbox');
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
