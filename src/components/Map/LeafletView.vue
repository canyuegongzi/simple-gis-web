<template lang="pug">
    .map
        #leaflet-container
        MarkerDialog
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import LeafletService from "../../map/service/LeafletService";
import { LeafletInstanceOptions } from '@/map/type/LeafletType';
import { ChangeLayerImageConfig } from '@/map/type/CommonType';
import MarkerDialog from '../../components/dialog/marker/MarkerDialog.vue';

@Component({
    components: {
        MarkerDialog,
    },
})
export default class LeafletView extends Vue {
    public async initMap() {
        const leafletProps: LeafletInstanceOptions = {
            id: 'leaflet-container',
        };
        const mapInstance: LeafletService = new LeafletService(leafletProps);
        const baiduOptions: ChangeLayerImageConfig = { style: 'vec', crs: 'BD09' };
        const map: any = await mapInstance.initMapInstance('LEAFLET', { id: 'leaflet-container' });
        // mapInstance.renderHtmlMarker('', [30, 120], map);
        // 画圆marker
        const marker: any = mapInstance.renderCircleMarker([30.369, 120.1258], {
            radius: 8,
        });
        // map.addLayer(marker);

        const groupLayer: any = mapInstance.renderMarkerToGroupLayer(map, [marker]);
        console.log(marker);
        console.log(groupLayer);
        mapInstance.changeLayer('天地图', baiduOptions, map);
        return map;
    }
}
</script>

<style scoped lang="stylus">
.map
    height 100%
    width 100%

    #leaflet-container
        height 100%
        width 100%
        z-index 1
</style>
