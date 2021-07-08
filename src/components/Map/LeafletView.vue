<template lang="pug">
    .map
        #leaflet-container
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LeafletService from '../../map/service/LeafletService';
import { LeafletInstanceOptions } from '@/map/type/LeafletType';
import { ChangeLayerImageConfig, MapTypeEnum } from '@/map/type/CommonType';
import { namespace } from 'vuex-class';

const appModule = namespace('appModule');
@Component({
    components: {},
})
export default class LeafletView extends Vue {

    @appModule.Mutation
    private setMapInstance!: (data: { mapType: MapTypeEnum, instance: any }) => void;

    @appModule.State
    private leafletMapInstance!: LeafletService;


    public async initMap() {
        const leafletProps: LeafletInstanceOptions = {
            id: 'leaflet-container',
        };
        const instance = new LeafletService(leafletProps);
        this.setMapInstance({ mapType: 'LEAFLET', instance });
        const baiduOptions: ChangeLayerImageConfig = { style: 'vec', crs: 'BD09' };
        const map: any = await instance.initMapInstance('LEAFLET', { id: 'leaflet-container' });
        (window as any).leafletMap = map;
        // leafletMapInstance.renderHtmlMarker('', [30, 120], map);
        // 画圆marker
        instance.changeLayer('天地图', baiduOptions, map);
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
<style lang="stylus">
.leaflet-icon-item
    width: 28px;
    height: 28px;
    background: green;
    border-radius: 14px;
    line-height: 28px;
    text-align: center;
    color: #ffff;

.leaflet-div-icon
    background transparent;
    width: 0 !important
    height: 0 !important
    border-radius: 14px;
    line-height: 28px;
    text-align: center;
    color: #ffff;
</style>
