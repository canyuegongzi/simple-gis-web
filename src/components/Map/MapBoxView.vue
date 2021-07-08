<template lang="pug">
    .map
        #mapbox-container
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MapBoxInstanceOptions } from '@/map/type/MapBoxType';
import MapBoxService from '../../map/service/MapBoxService';
import MapboxMarkerDialog from '../../components/dialog/marker/MapboxMarkerDialog.vue';
import { MapTypeEnum } from '@/map/type/CommonType';
import { namespace } from 'vuex-class';

const appModule = namespace('appModule');
@Component({
    components: {
        MapboxMarkerDialog,
    },
})
export default class MapBoxView extends Vue {

    @appModule.State
    private cesiumMapInstance!: MapBoxService;

    @appModule.Mutation
    private setMapInstance!: (data: { mapType: MapTypeEnum, instance: any }) => void;

    public async initMap() {
        const mapboxProps: MapBoxInstanceOptions = {
            id: 'mapbox-container',
        };
        const instance = new MapBoxService(mapboxProps);
        this.setMapInstance({ mapType: 'MAPBOX', instance });
        const map: any = await instance.initMapInstance('MAPBOX', { id: 'mapbox-container' });
        (window as any).mapboxMap = map;
        return map;
    }
}
</script>

<style scoped lang="stylus">
.map
    height 100%
    width 100%

#mapbox-container
    height 100%
    width 100%
    z-index 1
</style>
