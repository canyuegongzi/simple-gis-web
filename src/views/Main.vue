<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px" style="height: 100vh">
        <NavLeft :sidebarMenu="menuList.list" class="sidebar theme-bg" :currentMenu="currentMenu" :isSidebarNavCollapse="false"></NavLeft>
      </el-aside>
      <el-main style="height: 100vh;width: calc(100vw - 200px); padding: 0;position: relative">

<!--          <router-view v-slot="{ Component }">
            <transition name="el-fade-in-linear">
              <component :is="Component" />
            </transition>
          </router-view>-->
        <router-view />
        <SettingLayoutIcon @tapSetting="openSetting"/>
        <LeafletView v-show="mapType === 'LEAFLET'"></LeafletView>
        <CesiumView v-show="mapType === 'CESIUM'"></CesiumView>
        <MapboxView v-show="mapType === 'MAPBOX'"></MapboxView>
        <el-drawer v-model="settingStatus" direction="rtl" :z-index="8000" size="30%" @close="closeSetting">
          <template #title>
            <h4>控制面板</h4>
          </template>
          <SettingLayout />
        </el-drawer>
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts">
import {computed, defineComponent, onMounted, reactive, ref, watch, nextTick, onBeforeUnmount} from "vue";
import NavLeft from "../components/navLeft/NavLeft.vue";
import LeafletView from "../components/mapView/LeafletView.vue";
import CesiumView from "../components/mapView/CesiumView.vue";
import SettingLayoutIcon from "../components/common/SettingLayoutIcon.vue";
import SettingLayout from "../components/common/SettingLayout.vue";
import { useStore } from "vuex";
import MapboxView from "../components/mapView/MapboxView.vue";
import {list} from "../config/nav";

export default defineComponent({
  name: 'Main',
  setup() {
    const menuList = reactive({
      list: list
    })
    const openDrawerStatus = ref(false);
    onMounted(() => {
      store.commit('setCurrentMenu', list[0].children[0])
    })
    const openSetting = () => {
      store.commit('setSettingStatus', true)
    }
    const closeSetting = () => {
      store.commit('setSettingStatus', false)
    }
    let store = useStore();
    const settingStatus = computed(() => store.getters.settingStatus)
    const mapType = computed(() => store.getters.mapType)
    const currentMenu = computed(() => store.getters.currentMenu)
    watch(mapType, (newValue, oldValue) => {
      nextTick(() => {
        if (newValue === 'LEAFLET') {
          window?.leafletMapService?.map.invalidateSize(true);
        }
        if (newValue === 'MAPBOX') {
          window?.mapboxMapService?.map.resize();
        }

      })
    });
    return {
      settingStatus,
      menuList,
      openDrawerStatus,
      mapType,
      currentMenu,
      openSetting,
      closeSetting
    }
  },
  components: {
    NavLeft,
    LeafletView,
    CesiumView,
    MapboxView,
    SettingLayoutIcon,
    SettingLayout
  },
});
</script>
<style scoped>
>>>.el-drawer__header {
  margin: 0 !important;
}
>>>.el-drawer__body {
  padding: 8px !important;
}
</style>
