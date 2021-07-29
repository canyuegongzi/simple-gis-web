<template lang="pug">
    .pug-container
        p cesium 模型
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { MapTypeEnum } from '@/map/type/CommonType';
import CesiumService from '@/map/service/CesiumService';
import LeafletService from '@/map/service/LeafletService';
import MapBoxService from '@/map/service/MapBoxService';
import { namespace } from 'vuex-class';
import { Cesium3DTileset, Cesium3DTileStyle, HeadingPitchRange } from 'cesium';
const appModule = namespace('appModule');

@Component({})
export default class CesiumBaseModelPage extends Vue {

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

    public mounted() {
        setTimeout(() => {
            /*const tilesetModel = new Cesium3DTileset({
                // url: "http://127.0.0.1:8080/tileset.json"
                // url: "http://127.0.0.1:8080/tileset.json"
                url: "http://47.99.59.154/3dtile/hz/tileset.json"
                // url: "http://www4.skylineglobe.com/SG/b3dm/Hod-Hasharon_Build_3_Entire_2705.1724701/tileset.json"
            });*/

            const tilesetModel = (window as any).cesiumMap.scene.primitives.add(new Cesium3DTileset({
                url: "http://47.99.59.154/3dtile/hz/tileset.json"
            }));

            (window as any).cesiumMap.scene.primitives.add(tilesetModel);

            tilesetModel.readyPromise.then(function (tileset: any) {
                console.log(tileset);
                (window as any).cesiumMap.scene.primitives.add(tileset);
                //(window as any).cesiumMap.zoomTo(tileset, new HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 1.0));
            }).otherwise(function (error: any) {
                console.log(error);
            });

           /* tilesetModel.style = new Cesium3DTileStyle({
                color: {
                    conditions: [
                        ['${floor} >= 8', 'rgba(45, 0, 75, 0.5)'],
                        ['${floor} >= 7', 'rgb(102, 71, 151)'],
                        ['${floor} >= 6', 'rgb(170, 162, 204)'],
                        ['${floor} >= 5', 'rgb(224, 226, 238)'],
                        ['${floor} >= 4', 'rgb(252, 230, 200)'],
                        ['${floor} >= 3', 'rgb(248, 176, 87)'],
                        ['${floor} >= 2', 'rgb(198, 106, 11)'],
                        ['true', 'rgb(127, 59, 8)']]
                }
            });*/

            /*tilesetModel.style = new Cesium3DTileStyle({
                color: {
                    conditions: [
                        ['${floor} >= 8', 'rgba(45, 0, 75, 0.5)'],
                        ['${floor} >= 7', 'rgb(102, 71, 151)'],
                        ['${floor} >= 6', 'rgb(170, 162, 204)'],
                        ['${floor} >= 5', 'rgb(224, 226, 238)'],
                        ['${floor} >= 4', 'rgb(252, 230, 200)'],
                        ['${floor} >= 3', 'rgb(248, 176, 87)'],
                        ['${floor} >= 2', 'rgb(198, 106, 11)'],
                        ['true', 'rgb(127, 59, 8)']]
                }
            });
            console.log((window as any).cesiumMap.scene);
            (window as any).cesiumMap.scene.primitives.add(tilesetModel);
            (window as any).cesiumMap.zoomTo(tilesetModel, new HeadingPitchRange(0.0, -20, 0));*/
        }, 8000);

    }
}
</script>

<style scoped lang="stylus">
.pug-container
    background transparent
    z-index 888 !important
    position absolute
    top 0
</style>
