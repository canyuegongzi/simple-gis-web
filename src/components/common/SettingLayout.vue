<template>
  <div class="slide-container-setting">
    <div class="item-group">
      <div class="item-group-title">
        <span>地图类型</span>
      </div>
      <div class="item-group-content">
        <el-radio-group v-model="tempMapType" @change="(val: any) => settingChange('AMP_TYPE_CHANGE', val)">
          <el-radio :label="item" :key="item" v-for="(item, index) in mapTypeList"> {{item}}</el-radio>
        </el-radio-group>
      </div>
      <div class="item-group-title">
        <span>地图重置</span>
      </div>
      <div class="item-group-content" style="display: flex; justify-content: center;">
        <el-button :disabled="tempMapType!==item" type="primary" @click="resetMap(item)" style="height: 28px; line-height: 28px" :label="item" :key="item" v-for="(item, index) in mapTypeList">{{item}}</el-button>
      </div>
      <div v-show="tempMapType === 'CESIUM'">
        <div class="item-group-title">
          <span>CESIUM操作</span>
        </div>
        <div class="item-group-content" style="display: flex; justify-content: center;">

        </div>
      </div>
      <div v-show="tempMapType === 'MAPBOX'">
        <div class="item-group-title">
          <span>MAPBOX操作</span>
        </div>
        <div class="item-group-content" style="display: flex; justify-content: center;">

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed} from "vue";
import {useStore} from "vuex";
export const MapTypeList: MapTypeEnum[] = ['CESIUM', 'LEAFLET', 'MAPBOX'];
/**
 * 地图类型
 */
export type MapTypeEnum = 'CESIUM' | 'LEAFLET' | 'MAPBOX';
export default defineComponent({
  name: 'SettingLayout',
  setup() {
    let store = useStore();
    const mapTypeList = ref(MapTypeList);
    const tempMapType  = ref(computed(() => store.getters.mapType));
    const settingChange = (type: string, val: MapTypeEnum) => {
      store.commit('setMapType', val)
    }
    const resetMap = (mapType: MapTypeEnum) => {
      if (mapType === 'LEAFLET') {
        window.leafletMapService.resetMap();
      }
      if (mapType === 'CESIUM') {
        window.cesiumMapService.resetMap();
      }
      if (mapType === 'MAPBOX') {
        window.mapboxMapService.resetMap();
      }
    }
    return {
      mapTypeList,
      settingChange,
      tempMapType,
      resetMap
    }
  },
  components: {},
});
</script>

<style lang="stylus" scoped>
.slide-container-setting
  padding 16px 0 16px 0
  .title1
    display inline-block
    width 100%
    text-align center
    padding-bottom 16px
  .item-group
    .item-group-title
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 24px;
      border-radius: 4px;
      line-height: 24px;
      padding: 0 16px 0 8px;
      margin-top 8px
      background-color: #dcdfe6;
    .item-group-content
      padding 8px 16px 8px 16px
</style>
