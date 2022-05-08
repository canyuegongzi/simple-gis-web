<template>
  <div class="view-common-container">
    <div id="_mapbox_container">
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import {BaseService} from "../../map/service/mapbox";

export default defineComponent({
  name: 'MapboxView',
  setup() {
    onMounted(() => {
      // 实例化工具类
      const mapboxMapService = new BaseService();
      window.mapboxMapService = mapboxMapService;
      mapboxMapService.init(document.getElementById('_mapbox_container') as HTMLElement, {}, (map) => {});
    })
  },
  components: {},
});
</script>

<style scoped>
#_mapbox_container {
  width: 100%;
  height: 100%
}
</style>
