<template lang="pug">
    .pug-container
        CesiumLineDialog(@map:event="cesiumMapEvent" v-if="mapType === 'CESIUM'")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CesiumLineDialog from '../../components/dialog/line/CesiumLineDialog.vue';
import { MapTypeEnum } from '@/map/type/CommonType';
import CesiumService from '@/map/service/CesiumService';
import LeafletService from '@/map/service/LeafletService';
import MapBoxService from '@/map/service/MapBoxService';
import { namespace } from 'vuex-class';
const appModule = namespace('appModule');
@Component({
    components: {
        CesiumLineDialog
    }
})
export default class LinePage extends Vue {
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

    /**
     * 地图事件
     * @param data
     */
    public async cesiumMapEvent(data: any) {
        console.log(data);
        switch (data.action) {
        case 'renderLine':
            console.log('renderLine');
            break;
        case 'mouseRenderLine':
            console.log('mouseRenderLine');
            break;
        case 'deleteLine':
            console.log('deleteLine');
            break;
        case 'close':
            console.log('11');
            break;
        }

    }
}
</script>

<style scoped lang="stylus">
.pug-container
    height 100%
    width 100%
    background rebeccapurple
</style>
