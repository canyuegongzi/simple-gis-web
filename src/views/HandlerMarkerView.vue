<template>
  <div class="view-page-common-container">
    <CommonPopup>
      <template #default>
      </template>

    </CommonPopup>
  </div>
  <div class="control-container view-page-common-z-index">
    <div>
      <el-icon size="28px" color="red"><tools /></el-icon>
      <el-icon size="28px" color="blue"><tools /></el-icon>
      <el-icon size="28px" color="yellow"><tools /></el-icon>
    </div>

  </div>
  <div class="point-list-container view-page-common-z-index">
    <div class="point-item" v-for="(item, index) in getPointList()" :key="item.name">
      <el-popover placement="left" effect="dark" :width="400" trigger="click" width="150px" popper-class="point-left-popup-container-parent">
        <template #reference>
          <span>
            {{item.name}}点位
          </span>
        </template>
        <div class="point-left-popup-container">
          <p>纬度: {{item.position.latitude}}</p>
          <p>经度: {{item.position.longitude}}</p>
          <p v-show="item.position.altitude">高度: {{item.position.altitude}}</p>
        </div>
      </el-popover>
      <div>
        <el-icon color="red" @click="deleteMarker(index)">
          <delete />
        </el-icon>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeUnmount, onMounted, reactive} from "vue";
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
  PointGraphics,
  PolylineDashMaterialProperty, ScreenSpaceEventHandler, ScreenSpaceEventType, VerticalOrigin
} from "cesium";
import {geoJSON} from "leaflet";
import {processID} from "../utils/utils";
const currentMarker = {
  mapbox: []
}
let currentMapboxMarker: any = []
let currentCesiumMarker: any = []
let currentLeafletMarker: any = []
let handlerCesium: ScreenSpaceEventHandler;
export default defineComponent({
  name: 'HandlerMarkerView',
  setup() {
    let store = useStore();
    const mapType = computed(() => store.getters.mapType);
    const mapMarkerList: any = reactive({
      leaflet: [],
      cesium: [],
      mapbox: [],
    })

    const getPointList = () => {
      if (mapType.value === "MAPBOX") {
        return mapMarkerList.mapbox;
      }
      if (mapType.value === "LEAFLET") {
        return mapMarkerList.leaflet;
      }
      if (mapType.value === "CESIUM") {
        return mapMarkerList.cesium;
      }
    }
    const deleteMarker = (index: number) => {
      if (mapType.value === "MAPBOX") {
        currentMapboxMarker[index].remove();
        currentMapboxMarker.splice(index, 1);
        return mapMarkerList.mapbox.splice(index, 1);
      }
      if (mapType.value === "LEAFLET") {
        currentLeafletMarker[index].remove();
        currentLeafletMarker.splice(index, 1);
        return mapMarkerList.leaflet.splice(index, 1);
      }
      if (mapType.value === "CESIUM") {
        window.cesiumMapService.map.flyTo(currentCesiumMarker[index], { duration: 100 })
        window.cesiumMapService.map.entities.remove(currentCesiumMarker[index]);
        currentCesiumMarker.splice(index, 1);
        return mapMarkerList.cesium.splice(index, 1);
      }
    }
    const cleatMapboxMap = () => {
      for (let i = 0; i < currentMapboxMarker.length;  i++) {
        currentMapboxMarker[i].remove()
      }
      currentMapboxMarker = []
    }
    const clearCesiumMap = () => {
      for (let i = 0; i < currentCesiumMarker.length; i ++) {
        window.cesiumMapService.map.entities.remove(currentCesiumMarker[i]);
      }
      currentCesiumMarker = []
    }
    const clearLeaflet = () => {
      for (let i = 0; i < currentLeafletMarker.length; i ++) {
        currentLeafletMarker[i].remove()
      }
      currentLeafletMarker = []

    }
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
    onBeforeUnmount(() => {
      removeListerEventMapbox()
      removeListerEventCesium()
      removeListerEventLeaflet()
      cleatMapboxMap()
      clearCesiumMap()
      clearLeaflet()
      resetMap()
    })
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
    /**
     * mapbox 事件监听
     */
    const addListerEventMapbox = () => {
      window.mapboxMapService.map.on('click', mapBoxHandler)
    }
    const mapBoxHandler = (e: any) => {
      console.log(e)
      mapMarkerList.mapbox.push({
        position: {
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        } ,
        name: processID()
      });
      const latitude = parseFloat(e.lngLat.lat);
      const longitude = parseFloat(e.lngLat.lng);
      const marker = window.mapboxMapService.createMarker();
      marker.setLngLat([longitude, latitude]);
      marker.addTo(window.mapboxMapService.map);
      currentMapboxMarker.push(marker);
    }
    /**
     * mapbox 事件监听
     */
    const removeListerEventMapbox = () => {
      window.mapboxMapService.map.off('click', mapBoxHandler)
    }

    const addListerEventCesium = () => {
      handlerCesium = new ScreenSpaceEventHandler(window.cesiumMapService.map.scene.canvas);
      handlerCesium.setInputAction((click: any) =>  {
        console.log(click);
        cesiumHandler(click)
      }, ScreenSpaceEventType.LEFT_CLICK);
    }
    const cesiumHandler = (click: any) => {
      const pick = window.cesiumMapService.getCoordinate(click)
      const id = processID();
      mapMarkerList.cesium.push({
        position: {
          latitude: pick.latitude,
          longitude: pick.longitude,
          altitude: pick.altitude
        },
        name: id
      })
      const marker = window.cesiumMapService.createMarker({
        name: id,
        position: window.cesiumMapService.getPosition(pick.longitude, pick.latitude, pick.altitude),
        billboard: {
          image: site,
          scale: 1,
        },
      });
      currentCesiumMarker.push(marker);
      window.cesiumMapService.map.entities.add(marker);
      window.cesiumMapService.map.flyTo(marker, {})
    }
    const removeListerEventCesium = () => {
      handlerCesium.removeInputAction(ScreenSpaceEventType.LEFT_CLICK)
    }
    const leafletHandler = (e: any) => {
      const icon =  window.leafletMapService.createIcon({
        iconUrl: site,
      });
      const marker: any = window.leafletMapService.createMarker([e.latlng.lat, e.latlng.lng], {
        icon: icon,
      }).addTo(window.leafletMapService.map);
      currentLeafletMarker.push(marker)
      mapMarkerList.leaflet.push({
        position: {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        } ,
        name: processID()
      });
    }
    const addListerEventLeaflet = () => {
      window.leafletMapService.map.on('click', leafletHandler)

    }
    const removeListerEventLeaflet = () => {
      window.leafletMapService.map.off('click', leafletHandler)
    }
    onMounted(() => {
      addListerEventLeaflet()
      addListerEventMapbox();
      addListerEventCesium()
    })
    return {
      status,
      mapMarkerList,
      getPointList,
      deleteMarker
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
.point-list-container
  position absolute;
  right 0px;
  top 48px;
  background #ffffff
  min-width 180px;
  max-height 400px;
  overflow: inherit;
  border-top-left-radius 8px
  border-bottom-left-radius 8px
  .point-item
    cursor pointer
    padding-left 8px
    padding-right 8px
    height 32px
    display flex
    justify-content: space-between;
    align-items center
    flex-direction row
.point-left-popup-container
  width 100%
.control-container
  position absolute
  bottom 16px
  right 16px
  cursor pointer
</style>
<style lang="stylus">
.point-left-popup-container-parent
  width 200px !important
  z-index 4005 !important
</style>
