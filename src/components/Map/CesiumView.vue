<template lang="pug">
    .map
        #cesium-container
        CesiumMarkerDialog(@map:event="mapEvent")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { CesiumInstanceOptions } from '@/map/type/CesiumType';
import CesiumService from '../../map/service/CesiumService';
import { ChangeLayerImageConfig } from '@/map/type/CommonType';
import CesiumMarkerDialog from '../../components/dialog/marker/CesiumMarkerDialog.vue';

@Component({
    components: {
        CesiumMarkerDialog,
    },
})
export default class CesiumView extends Vue {
    private mapInstance: CesiumService;

    public async initMap() {
        const cesiumProps: CesiumInstanceOptions = {
            id: 'cesium-container',
        };
        this.mapInstance = new CesiumService(cesiumProps);
        const map: any = await this.mapInstance.initMapInstance('CESIUM', { id: 'cesium-container' });


        // const amapOptions: ChangeLayerImageConfig = { style: 'elec', crs: 'WGS84' };
        // mapInstance.changeLayer('AMAP', amapOptions, map);
        const baiduOptions: ChangeLayerImageConfig = { style: 'vec', crs: 'BD09' };
        (window as any).cesiumMap = map;
        this.mapInstance.changeLayer('BAIDU', baiduOptions, map);
        return map;
    }

    /**
     * 地图事件
     * @param data
     */
    public async mapEvent(data: any) {
        console.log(data);
        if (data.action === 'MARKER') {
            let markerList = [];
            // 普通marker
            if (data.data.markerType === 1) {
                switch (data.data.styleType) {
                    case 3:

                        break;
                    case 2:

                        break;
                    case 1:
                        console.log('cesium点位渲染');
                        break;
                }
            }
            if (data.data.markerType === 2) {
                switch (data.data.styleType) {
                    case 3:

                        break;
                    case 2:

                        break;
                    case 1:

                        break;
                }
            }

        }
        if (data.action === 'CLEAR') {

        }

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
