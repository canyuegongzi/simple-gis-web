<template lang="pug">
    #mapbox-container
        p mapbox
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { MapBoxInstanceOptions } from '@/map/type/MapBoxType';
import CommonStore from '../../map/common/CommonStore';
import MapBoxService from "../../map/service/MapBoxService";

@Component({})
export default class MapBoxView extends Vue {
    public async initMap() {
        const mapboxProps: MapBoxInstanceOptions = {
            id: 'mapbox-container'
        };
        const mapInstance: any = new MapBoxService(mapboxProps);
        const map: any = await mapInstance.initMapInstance('MAPBOX', { id: 'mapbox-container' });
        return map;
    }
}
</script>

<style scoped lang="stylus">
#mapbox-container
    height 100%
    width 100%
    z-index 1
</style>
