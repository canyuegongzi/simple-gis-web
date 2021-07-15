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
import { Cartesian2, Cartesian3, Entity, Color, CallbackProperty, PolylineDashMaterialProperty } from 'cesium';
const appModule = namespace('appModule');

const cesiumLayer = {
    drawEntityCesium: null,  // cesium 线断实体
};

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


    /************************************  CESIUM  ***********************************************************/

    /************************************  start  ***********************************************************/
    /**
     * 渲染 cesium 实体 的线
     */
    public async renderEntityLine() {
        this.deleteEntityLine();
        const positionList: number[] = [];
        const dataJson: any[] = await import('../../mock/line/stationList1.json');
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            // const position = Cartesian3.fromDegrees(longitude, latitude);
            positionList.push(longitude);
            positionList.push(latitude);
        }
        console.log(positionList);
        const drawEntity: Entity = new Entity({
            polyline: {
                positions: Cartesian3.fromDegreesArray(positionList),
                width: 2,
                material: Color.BLUE,
                // material: new PolylineDashMaterialProperty({
                //     color: Color.RED,
                // }),
                // depthFailMaterial: new PolylineDashMaterialProperty({
                //     color: Color.YELLOW,
                // }),
            }
        });
        (window as any).cesiumMap.entities.add(drawEntity);
        (window as any).cesiumMap.flyTo(drawEntity);
        (cesiumLayer as any).drawEntityCesium = drawEntity;
        return drawEntity;
    }

    /**
     * 删除线段绘制实体图层
     */
    public deleteEntityLine() {
        if ((cesiumLayer as any).drawEntityCesium) {
            (window as any).cesiumMap.entities.remove((cesiumLayer as any).drawEntityCesium);
            (cesiumLayer as any).drawEntityCesium = null;
        }

    }

    /**
     * 地图事件
     * @param data
     */
    public async cesiumMapEvent(data: any) {
        console.log(data);
        switch (data.action) {
        case 'renderLine':
            await this.renderEntityLine();
            console.log('renderLine');
            break;
        case 'mouseRenderLine':
            console.log('mouseRenderLine');
            break;
        case 'deleteLine':
            await this.deleteEntityLine();
            console.log('deleteLine');
            break;
        case 'close':
            console.log('11');
            break;
        }

    }

    /************************************  end  ***********************************************************/
    public beforeDestroy() {
        this.deleteEntityLine();

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
