<template lang="pug">
    .pug-container
        InterpolationDialog(@map:event="mapEvent")
</template>

<script lang="ts">
import InterpolationDialog from '../../components/dialog/interpolation/InterpolationDialog.vue';
import { Vue, Component } from 'vue-property-decorator';
import { MapTypeEnum } from '@/map/type/CommonType';
import CesiumService from '@/map/service/CesiumService';
import LeafletService from '@/map/service/LeafletService';
import MapBoxService from '@/map/service/MapBoxService';
import { namespace } from 'vuex-class';
const appModule = namespace('appModule');

@Component({
    components: {
        InterpolationDialog
    }
})
export default class InterpolationPage extends Vue {
    @appModule.State
    public mapType!: MapTypeEnum;

    @appModule.State
    private cesiumMapInstance!: CesiumService;

    @appModule.State
    private leafletMapInstance!: LeafletService;

    @appModule.State
    private mapBoxMapInstance!: MapBoxService;

    @appModule.Mutation
    private setMapType!: (number: MapTypeEnum) => void;

    /************************************  Cesium  ***********************************************************/

    /************************************  start  ***********************************************************/

    /**
     * 时间处理
     * @param data
     */
    public mapEvent(data: any) {
        console.log('地图事件处理');
        console.log(data);
    }

    /************************************  end  ***********************************************************/

    /************************************  MapBox  ***********************************************************/

    /************************************  start  ***********************************************************/

    /************************************  end  ***********************************************************/
}
</script>

<style scoped lang="stylus">
.pug-container
    height 100%
    width 100%
    background rebeccapurple
</style>
