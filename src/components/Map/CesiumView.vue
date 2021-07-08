<template lang="pug">
    .map
        #cesium-container
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { CesiumInstanceOptions } from '@/map/type/CesiumType';
import { Cartesian3, EasingFunction, Viewer, Math } from 'cesium';
import CesiumService from '../../map/service/CesiumService';
import { ChangeLayerImageConfig, MapTypeEnum } from '@/map/type/CommonType';
import CesiumMarkerDialog from '../../components/dialog/marker/CesiumMarkerDialog.vue';
import { namespace } from 'vuex-class';

const appModule = namespace('appModule');

@Component({
    components: {
        CesiumMarkerDialog,
    },
})
export default class CesiumView extends Vue {

    @appModule.State
    private cesiumMapInstance!: CesiumService;

    @appModule.Mutation
    private setMapInstance!: (data: { mapType: MapTypeEnum, instance: any }) => void;

    public async initMap() {
        const cesiumProps: CesiumInstanceOptions = {
            id: 'cesium-container',
        };
        const mapInstance = new CesiumService(cesiumProps);
        this.setMapInstance({ mapType: 'CESIUM', instance: mapInstance });
        const map: Viewer = await this.cesiumMapInstance.initMapInstance('CESIUM', { id: 'cesium-container' });


        // const amapOptions: ChangeLayerImageConfig = { style: 'elec', crs: 'WGS84' };
        // mapInstance.changeLayer('AMAP', amapOptions, map);
        const baiduOptions: ChangeLayerImageConfig = { style: 'vec', crs: 'BD09' };
        (window as any).cesiumMap = map;
        this.cesiumMapInstance.changeLayer('AMAP', baiduOptions, map);
        this.cesiumMapInstance.flyTo(((window as any).cesiumMap as any).camera, {
            destination: Cartesian3.fromDegrees(120.6789987, 30.260000, 9000),
            duration: 5,
            easingFunction: EasingFunction.LINEAR_NONE,
            orientation: {
                heading: Math.toRadians(-15),
                pitch: Math.toRadians(-82),
                roll: Math.toRadians(0),
            },
            complete: () => {
                console.log('地图加载完毕');
            },
        });
        return map;
    }
}
</script>

<style scoped lang="stylus">
.map
    height 100%
    width 100%

#cesium-container
    height 100%
    width 100%
    z-index 1
</style>
