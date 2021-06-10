<template lang="pug">
    #leaflet-container
        p leaflet
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import LeafletService from "../../map/service/LeafletService";
import { LeafletInstanceOptions } from '@/map/type/LeafletType';
import { ChangeLayerImageConfig } from '@/map/type/CommonType';

@Component({})
export default class LeafletView extends Vue {
    public async initMap() {
        const leafletProps: LeafletInstanceOptions = {
            id: 'leaflet-container'
        };
        const mapInstance: LeafletService = new LeafletService(leafletProps);
        const baiduOptions: ChangeLayerImageConfig = { style: 'vec', crs: 'BD09' };
        const map: any = await mapInstance.initMapInstance('LEAFLET', { id: 'leaflet-container' });

        mapInstance.changeLayer('天地图', baiduOptions, map);
        return map;
    }
}
</script>

<style scoped lang="stylus">
#leaflet-container
    height 100%
    width 100%
    z-index 1
</style>
