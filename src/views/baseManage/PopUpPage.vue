<template lang="pug">
    .pug-container
        CesiumPopUpDialog(@map:event="cesiumMapEvent" v-if="mapType === 'CESIUM'")
        MapboxPopUpDialog(@map:event="mapboxMapEvent" v-if="mapType === 'MAPBOX'")
        LeafletPopUpDialog(@map:event="leafletMapEvent" v-if="mapType === 'LEAFLET'")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CesiumPopUpDialog from '../../components/dialog/popUp/CesiumPopUpDialog.vue';
import MapboxPopUpDialog from '../../components/dialog/popUp/MapboxPopUpDialog.vue';
import LeafletPopUpDialog from '../../components/dialog/popUp/LeafletPopUpDialog.vue';
import { namespace } from 'vuex-class';
import { MapTypeEnum } from '@/map/type/CommonType';
import CesiumService from '@/map/service/CesiumService';
import LeafletService from '@/map/service/LeafletService';
import MapBoxService from '@/map/service/MapBoxService';
import { Cartesian2, Cartesian3, Entity, ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium';
import { CesiumCustomPopUp } from '../../map/service/cesium/widgets/CesiumCustomPopUp';
import VuePointDetailComponent from '../../components/dialog/popUp/commonWidget/VuePointDetailComponent.vue';
import { Popup } from 'mapbox-gl';
import { Icon, Marker, MarkerOptions, Popup as LeafletPopup } from 'leaflet';
const appModule = namespace('appModule');

let windowVm = Vue.extend(VuePointDetailComponent);
@Component({
    components: {
        CesiumPopUpDialog,
        MapboxPopUpDialog,
        LeafletPopUpDialog
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

    public resourceLayerMapBox: any = null;  // mapbox 点位图层

    public glPopupMapbox: Popup | null = null; // mapbox  弹框实例

    public normalLayer1Leaflet: any = null;  // 普通圆圈
    private leafletPopUp: LeafletPopup | null = null;


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
    /************************************  MAPBOX  ***********************************************************/
    /************************************  start  ***********************************************************/
    /**
     * mapbox 事件处理
     */
    public async mapboxMapEvent(data: any) {
        console.log(data);
        switch (data.action) {
        case 'renderMarker':
            const LayerId: any = await this.renderMarkerMapbox();
            if (LayerId) {
                this.resourceLayerMapBox = LayerId;
                this.addListerEventMapbox(LayerId);
            }
            break;
        case 'deleteMarker':
            return this.deleteMarkerMapbox();
        case 'open':
            console.log('打开弹框');
            break;
        case 'close':
            return this.closePopUpMapbox();
        }
    }

    /**
     * 构造GeoJSON数据，给每个属性增加symbolName字段（该字段用于匹配图标）
     * @param dataList
     * @param code
     * @returns {*}
     */
    public buildGeoJSONDataMapBox(dataList: any[], code: string) {
        let GeoJsonHeader: any = this.mapBoxMapInstance.getCommonGeoJson();
        for (let i = 0; i < dataList.length; i++) {
            const point = { ...dataList[i] };
            let lon = parseFloat(point.longitude);
            let lat = parseFloat(point.latitude);
            // TODO 判断存在误差，后期改进
            let coordinates = lon > lat ? [lon, lat, 0] : [lat, lon, 0]; //存在经纬度录反的情况
            // 处理一下point，添加symbolImgName字段，用以匹配图标资源,
            if (code) {
                point['typeCode'] = point.hasOwnProperty('typeCode') ? point.typeCode : code;
                point['symbolImgName'] = 'site5';
            }
            let featureItem = {
                type: 'Feature',
                properties: { ...point },
                geometry: { type: 'Point', coordinates: coordinates },
            };
            GeoJsonHeader.features.push(featureItem);
        }
        return GeoJsonHeader;
    }


    /**
     * mapbox 渲染
     */
    public async renderMarkerMapbox() {
        console.log('渲染marker');
        const dataJson: any[] = await import('../../mock/popUp/stationList1.json');
        await this.mapBoxMapInstance.loadImages({
            site5: require('../../assets/map/site-5.png'),
        }, (window as any).mapboxMap);
        const sourceId: string = 'test-source';
        let jsonData = this.buildGeoJSONDataMapBox(dataJson, '1');
        await this.mapBoxMapInstance.addSourceToMap(sourceId, jsonData, (window as any).mapboxMap);
        return await this.mapBoxMapInstance.renderMarkerLayer(
            {
                id: 'test-layer1',
                type: 'symbol',
                source: sourceId,
                filter: ['==', 'typeCode', '1'],
                layout: {
                    'icon-image': '{symbolImgName}', //图片的source
                    'icon-size': 1.2,
                    'icon-ignore-placement': true, //忽略碰撞检测
                    visibility: 'visible',
                },
            },
            (window as any).mapboxMap,
        );
    }

    /**
     * 删除mapbox
     */
    public deleteMarkerMapbox() {
        console.log('删除marker');
        this.closePopUpMapbox();
        console.log(this.resourceLayerMapBox);
        if (this.resourceLayerMapBox && (window as any).mapboxMap.getLayer(this.resourceLayerMapBox)) {
            // 移除掉图层点击事件
            (window as any).mapboxMap.off('click', this.resourceLayerMapBox, this.clickEventHandler);
            this.mapBoxMapInstance.showOrHideMapLayerById(this.resourceLayerMapBox, 'hide', (window as any).mapboxMap);
            //(window as any).mapboxMap.removeLayer(this.resourceLayerMapBox);
            // this.resourceLayerMapBox = null;
        }
    }

    /**
     * 点击事件处理
     */
    public clickEventHandler(e: any) {
        let coordinates = e.features[0].geometry.coordinates.slice(); //图标的经纬度
        console.log(coordinates);
        console.log(e.features[0].properties);
        const vmInstance: any = new windowVm({
            propsData: {
                info: { name: e.features[0].properties.name },
                closePopUp: () => {
                    this.closePopUpMapbox();
                },
            }
        });
        this.closePopUpMapbox();
        this.glPopupMapbox = new Popup({
            className: 'blue-popup',
            closeOnClick: true,
            closeButton: false,
            offset: [0, 0],
        }).setLngLat(coordinates).setDOMContent(vmInstance.$mount().$el).setMaxWidth('none').addTo((window as any).mapboxMap);

        (window as any).mapboxMap.easeTo({
            center: [coordinates[0], coordinates[1]],
            speed: 0.6,
            curve: 1.0,
        });


    }

    /**
     * 事件监听
     */
    public addListerEventMapbox(layerId: string) {
        console.log(layerId);
        (window as any).mapboxMap.on('click', layerId, this.clickEventHandler);
    }

    /**
     * 关闭弹框
     */
    public closePopUpMapbox() {
        if (this.glPopupMapbox) {
            this.glPopupMapbox.remove();
            this.glPopupMapbox = null;
        }
    }


    /************************************  end  ***********************************************************/
    /************************************  MAPBOX  ***********************************************************/
    /************************************  start  ***********************************************************/

    /**
     * 渲染icon  marker
     */
    public async renderNormalIconMarkerLeaflet() {
        const dataJson: any[] = await import('../../mock/popUp/stationList1.json');
        const markerList: any[] = [];
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const icon: Icon = this.leafletMapInstance.createIcon({
                iconUrl: require('../../assets/map/site.png'),
            });
            const marker: Marker = this.leafletMapInstance.createMarker([latitude, longitude], {
                icon: icon,
                description: JSON.stringify(dataJson[i])
            } as MarkerOptions);
            marker.addEventListener('click', this.leafletMarkerHandler);
            markerList.push(marker);
        }
        return markerList;
    }

    /**
     * leaflet 点击事件
     */
    public leafletMarkerHandler(e: any) {
        try {
            this.removePopupLeaflet();
            const data: any = JSON.parse(e.sourceTarget.options.description);
            const vmInstance: any = new windowVm({
                propsData: {
                    info: { name: data.name },
                    closePopUp: () => {
                        this.removePopupLeaflet();
                    },
                }
            }).$mount();
            this.leafletPopUp = new LeafletPopup().setLatLng(e.latlng).setContent(vmInstance.$el).openOn((window as any).leafletMap);
            (window as any).leafletMap.flyTo(e.latlng);
        }catch (e) {
            console.log(e);
        }
    }

    /**
     * 删除marker
     */
    public deleteMarkerLeaflet() {
        if ((window as any).leafletMap.hasLayer(this.normalLayer1Leaflet)) {
            (window as any).leafletMap.removeLayer(this.normalLayer1Leaflet);
        }
        this.removePopupLeaflet();
    }

    /**
     * 删除leaflet popup
     */
    public removePopupLeaflet() {
        if (this.leafletPopUp && this.leafletPopUp.isOpen()) {
            this.leafletPopUp.remove();
            this.leafletPopUp = null;
        }
    }
    /**
     * leaflet 事件处置
     */
    public async leafletMapEvent(data: any) {
        console.log(data);
        switch (data.action) {
        case 'renderMarker':
            this.deleteMarkerLeaflet();
            const markerList = await this.renderNormalIconMarkerLeaflet();
            this.normalLayer1Leaflet = this.leafletMapInstance.renderMarkerToGroupLayer((window as any).leafletMap, markerList);
            break;
        case 'deleteMarker':
            this.deleteMarkerLeaflet();
            break;
        case 'open':
            break;
        case 'close':
            return this.removePopupLeaflet();
        }
    }
    /************************************  end  ***********************************************************/
    public beforeDestroy() {
        try {
            this.deleteEntityListLayerMarkerCesium();
            this.deleteMarkerMapbox();
            this.deleteMarkerLeaflet();
        }catch (e) {
            console.warn(e);
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
<style lang="stylus">
.leaflet-popup-close-button
    display none
</style>
