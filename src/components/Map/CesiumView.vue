<template lang="pug">
    #cesium-container
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { CesiumInstanceOptions } from '@/map/type/CesiumType';
import CesiumService from '../../map/service/CesiumService';
import { ChangeLayerImageConfig } from '@/map/type/CommonType';

@Component({})
export default class CesiumView extends Vue {
    public async initMap() {
        const cesiumProps: CesiumInstanceOptions = {
            id: 'cesium-container',
        };
        const mapInstance: CesiumService = new CesiumService(cesiumProps);
        const map: any = await mapInstance.initMapInstance('CESIUM', { id: 'cesium-container' });


        // const amapOptions: ChangeLayerImageConfig = { style: 'elec', crs: 'WGS84' };
        // mapInstance.changeLayer('AMAP', amapOptions, map);
        const baiduOptions: ChangeLayerImageConfig = { style: 'vec', crs: 'BD09' };
        mapInstance.changeLayer('BAIDU', baiduOptions, map);
        return map;
    }
}
</script>

<style scoped lang="stylus">
#cesium-container
    height 100%
    width 100%
    z-index 1
</style>
