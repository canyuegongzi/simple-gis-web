<template>
  <div class="view-common-container">
    <div id="_cesium_container">
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import {BaseService} from "../../map/service/cesium";

export default defineComponent({
  name: 'CesiumView',
  setup() {
    onMounted(() => {
      // 实例化工具类
      const cesiumMapService = new BaseService();
      window.cesiumMapService = cesiumMapService;
      cesiumMapService.init(document.getElementById('_cesium_container') as HTMLElement, {
        homeButton: false
      }, (map) => {
        // 启用地球照明
        map.scene.globe.enableLighting = true;
      });
    })
  },
  components: {},
});
</script>

<style scoped>
#_cesium_container {
  width: 100%;
  height: 100%
}
</style>
