<template lang="pug">
    .pug-container
        CesiumPopUpDialog(@map:event="cesiumMapEvent" v-if="mapType === 'CESIUM'")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CesiumPopUpDialog from '../../components/dialog/popUp/CesiumPopUpDialog.vue';
import { namespace } from 'vuex-class';
import { MapTypeEnum } from '@/map/type/CommonType';
import CesiumService from '@/map/service/CesiumService';
import LeafletService from '@/map/service/LeafletService';
import MapBoxService from '@/map/service/MapBoxService';
import { Cartesian2, Cartesian3, Entity, ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium';
import { CesiumCustomPopUp } from '../../map/service/cesium/widgets/CesiumCustomPopUp';
import VuePointDetailComponent from '../../components/dialog/popUp/commonWidget/VuePointDetailComponent.vue';
const appModule = namespace('appModule');

let windowVm = Vue.extend(VuePointDetailComponent);
@Component({
    components: {
        CesiumPopUpDialog
    }
})
export default class PopUpPage extends Vue {
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

    private popUpWindowCesium: CesiumCustomPopUp | null;

    private normalIconCesium: any[] = [];

    private handlerCesium: ScreenSpaceEventHandler | null = null;

    /************************************  CESIUM  ***********************************************************/

    /************************************  start  ***********************************************************/
    /**
     * 渲染普通marker（實體集合）
     */
    public async renderEntityListLayerMarkerCesium() {
        if (!this.handlerCesium) {
            this.initMapEventHandlerCesium();
        }
        let dataJson: any[] = await import('../../mock/popUp/stationList1.json');
        const markerList: Entity[] = [];
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const marker: Entity = this.cesiumMapInstance.createMarker({
                name: dataJson[i].name,
                description: JSON.stringify(dataJson[i]),
                position: Cartesian3.fromDegrees(longitude, latitude),
                billboard: {
                    image: require('../../assets/map/site-5.png'),
                    scale: 1,
                    pixelOffset: new Cartesian2(0, -10),
                },
            });
            this.normalIconCesium.push(marker);
            (window as any).cesiumMap.entities.add(marker);
        }
        return markerList;
    }

    /**
     * 初始化点击事件
     */
    public initMapEventHandlerCesium() {
        this.handlerCesium = new ScreenSpaceEventHandler((window as any).cesiumMap.scene.canvas);
        this.handlerCesium.setInputAction((click: any) =>  {
            const pick = (window as any).cesiumMap.scene.pick(click.position);
            this.openPopUpCesium(pick, click.position);
        }, ScreenSpaceEventType.LEFT_CLICK);
    }

    /**
     * 打开弹框
     */
    public openPopUpCesium(info: any, position: any) {
        // console.log(info.id.description._value);
        // console.log(info.id._position._value);
        // console.log(position);
        const entity: any = JSON.parse(info.id.description._value);
        this.closePopUpCesium();
        // 第一种方式： 直接拼接 dom
        // const container: HTMLElement =  document.createElement('div');
        // container.setAttribute('id', 'testPupUp');
        // container.style.cssText = 'width: 250px; height: 100px; background: red; position: absolute; left: 0; bottom: 0';
        // container.innerHTML = `<div style="" id="testPupUp">
        //                               <span>这是弹框</span>
        //                       </div>`;
        // 第二种 使用 vue 对象 mount 后得到 dom 元素
        const vmInstance: any = new windowVm({
            propsData: {
                info: { name: entity.name },
                closePopUp: () => {
                    this.closePopUpCesium();
                },
            }
        }).$mount();
        this.popUpWindowCesium = new CesiumCustomPopUp({
            viewer: (window as any).cesiumMap,
            $sel: vmInstance.$el,
            position: info.id._position._value
        });
        (window as any).cesiumMap.flyTo(info.id);
    }

    /**
     * 关闭弹框
     */
    public closePopUpCesium() {
        if (this.popUpWindowCesium) {
            this.popUpWindowCesium.destroy();
            this.popUpWindowCesium = null;
        }
    }

    /**
     * 渲染普通marker（實體集合）
     */
    public async deleteEntityListLayerMarkerCesium() {
        try {
            // 普通
            for (let i = 0; i < this.normalIconCesium.length; i++) {
                (window as any).cesiumMap.entities.remove(this.normalIconCesium[i]);
            }
            this.normalIconCesium = [];
            if (this.handlerCesium) {
                this.handlerCesium.destroy();
                this.handlerCesium = null;
            }
            this.closePopUpCesium();
        } catch (e) {
            console.warn(e);
        }
    }
    /**
     * 地图事件
     * @param data
     */
    public async cesiumMapEvent(data: any) {
        console.log(data);
        switch (data.action) {
        case 'renderMarker':
            return this.renderEntityListLayerMarkerCesium();
        case 'deleteMarker':
            return this.deleteEntityListLayerMarkerCesium();
        case 'open':
            console.log('打开弹框');
            break;
        case 'close':
            return this.closePopUpCesium();
        }

    }
    /************************************  end  ***********************************************************/

    public beforeDestroy() {
        this.deleteEntityListLayerMarkerCesium();

    }
}
</script>

<style scoped lang="stylus">
.pug-container
    height 100%
    width 100%
    background rebeccapurple
</style>
