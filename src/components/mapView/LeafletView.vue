<template>
  <div class="view-common-container">
    <div id="_leaflet_container">
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import { BaseService } from "../../map/service/leaflet";

export default defineComponent({
  name: 'LeafletView',
  setup() {
    onMounted(() => {
      // 实例化工具类
      const leafletMapService = new BaseService();
      window.leafletMapService = leafletMapService;
      leafletMapService.init(document.getElementById('_leaflet_container') as HTMLElement, {
        zoom: 5
      });
      leafletMapService.initLayer();
    })
  },
  components: {},
});
</script>

<style scoped>
#_leaflet_container {
  width: 100%;
  height: 100%
}
</style>
