<template lang="pug">
    #leaflet-container
        p leaflet
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import LeafletService from "../../map/service/LeafletService";
import { LeafletInstanceOptions } from '@/map/type/LeafletType';
import CommonStore from '../../map/common/CommonStore';

@Component({})
export default class LeafletView extends Vue {
    public async mounted() {
        console.log('地图初始化');
    }

    public async initMap() {
        const leafletProps: LeafletInstanceOptions = {
            id: 'leaflet-container'
        };
        const mapInstance: any = new LeafletService(leafletProps);
        const map: any = await mapInstance.initMapInstance('LEAFLET', { id: 'leaflet-container' });
        console.log('leaflet初始化');
        console.log(await CommonStore.getInstance('LEAFLET'));
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
