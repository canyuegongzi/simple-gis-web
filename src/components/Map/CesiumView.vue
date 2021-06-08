<template lang="pug">
    #cesium-container
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { CesiumInstanceOptions } from '../../map/type/CesiumType';
import CesiumService from '../../map/service/CesiumService';

@Component({})
export default class CesiumView extends Vue {
    public async initMap() {
        const cesiumProps: CesiumInstanceOptions = {
            id: 'cesium-container',
        };
        const mapInstance: any = new CesiumService(cesiumProps);
        const map: any = await mapInstance.initMapInstance('CESIUM', { id: 'cesium-container' });
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
