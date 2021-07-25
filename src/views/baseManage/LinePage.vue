<template lang="pug">
    .pug-container
        CesiumLineDialog(@map:event="cesiumMapEvent" v-if="mapType === 'CESIUM'")
        MapboxLineDialog(@map:event="mapBoxMapEvent" v-if="mapType === 'MAPBOX'")
        LeafletLineDialog(@map:event="leafletMapEvent" v-if="mapType === 'LEAFLET'")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CesiumLineDialog from '../../components/dialog/line/CesiumLineDialog.vue';
import MapboxLineDialog from '../../components/dialog/line/MapboxLineDialog.vue';
import LeafletLineDialog from '../../components/dialog/line/LeafletLineDialog.vue';
import { MapTypeEnum } from '@/map/type/CommonType';
import CesiumService from '@/map/service/CesiumService';
import LeafletService from '@/map/service/LeafletService';
import MapBoxService from '@/map/service/MapBoxService';
import { namespace } from 'vuex-class';
import {
    Cartesian2,
    Cartesian3,
    Entity,
    Color,
    CallbackProperty,
    PolylineGlowMaterialProperty,
    PolylineDashMaterialProperty,
    GeoJsonDataSource,
    PointGraphics,
    HorizontalOrigin,
} from 'cesium';
import { geoJSON, Polygon, Polyline } from 'leaflet';
import { LabelStyle } from 'cesium';
import { VerticalOrigin } from 'cesium';
const appModule = namespace('appModule');

const cesiumLayer: any = {
    drawEntityCesium: null,  // cesium 线断实体
    geoJsonLineCesium: null,
    geoJsonLineMapBox: null,
    polylineLeaflet: null,
    polylineLeafletGeoJson: null,

};

@Component({
    components: {
        CesiumLineDialog,
        MapboxLineDialog,
        LeafletLineDialog
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
     * 组织GeoJson数据（要素列表套壳）
     * @param features<Array> 要素列表
     */
    public getCommonGeoJsonCesium(features = []) {
        return {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
            },
            features: features,
        };
    }

    /**
     * 拼裝geoJson
     */
    public async buildGeoJsonCesium() {
        const dataJson: any[] = await import('../../mock/line/stationList1.json');
        let GeoJsonHeader: any = await this.getCommonGeoJsonCesium([]);
        let featureItem: any = {
            type: 'Feature',
            properties: { id: 'test-line' },
            geometry: {
                type: "LineString",
                coordinates: []
            },
        };
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            featureItem.geometry.coordinates.push([longitude, latitude, 0]);
        }
        GeoJsonHeader.features.push(featureItem);
        return GeoJsonHeader;
    }

    /**
     * 拼裝geoJson
     */
    public async buildGeoJsonMapbox() {
        const dataJson: any[] = await import('../../mock/line/stationList1.json');
        let GeoJsonHeader: any = await this.getCommonGeoJsonCesium([]);
        let featureItem: any = {
            type: 'Feature',
            properties: { id: 'test-line' },
            geometry: {
                type: "LineString",
                coordinates: []
            },
        };
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            featureItem.geometry.coordinates.push([longitude, latitude]);
        }
        GeoJsonHeader.features.push(featureItem);
        return { geoJson: GeoJsonHeader, position: featureItem.geometry.coordinates[0] };
    }

    /**
     * 拼裝geoJson
     */
    public async buildLeafletLineData() {
        const dataJson: any[] = await import('../../mock/line/stationList1.json');
        const data: any = [];
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            data.push([latitude, longitude]);
        }
        return { data, position: data[3] };
    }

    /************************************  CESIUM  ***********************************************************/

    /************************************  start  ***********************************************************/
    /**
     * 渲染 cesium 实体 的线
     */
    public async renderEntityLineCesium() {
        this.deleteEntityLineCesium();
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
                material: Color.BLUE,  // 线条材质
                // material: new PolylineDashMaterialProperty({
                //     color: Color.RED,
                // }),
                // depthFailMaterial: new PolylineDashMaterialProperty({
                //     color: Color.YELLOW,
                // }),
                // followSurface: false, //取消弯曲
                // clampToGround: true

            },
            label: {
                text: '超完美线条',  //文本
                show: true,  // 默认显示
                font: '12pt Source Han Sans CN',    //字体样式
                fillColor: Color.GOLD,        //字体颜色
                backgroundColor: Color.AQUA,    //背景颜色
                //showBackground:true,                //是否显示背景颜色
                style: LabelStyle.FILL,        //label样式
                outlineWidth: 1,
                verticalOrigin: VerticalOrigin.CENTER,//垂直位置
                horizontalOrigin: HorizontalOrigin.LEFT,//水平位置
                pixelOffset: new Cartesian2(5, 0)            //偏移
            }
        });
        (window as any).cesiumMap.entities.add(drawEntity);
        (window as any).cesiumMap.flyTo(drawEntity);
        (cesiumLayer as any).drawEntityCesium = drawEntity;
        return drawEntity;
    }

    /**
     * 渲染 cesium geo 的线
     */
    public async renderGeoLineCesium() {
        this.deleteEntityLineCesium();
        // 点数据构造成线数据
        const geoJson = await this.buildGeoJsonCesium();
        const geoJsonResource = await GeoJsonDataSource.load(geoJson);
        cesiumLayer.geoJsonLineCesium = await (window as any).cesiumMap.dataSources.add(geoJsonResource);
        const entities = geoJsonResource.entities.values;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            entity.billboard = undefined;
            (entity as any).nameID  = `${i}-test-line`;
            (entity as any).polyline.width = 2;
            (entity as any).polyline.material = new PolylineDashMaterialProperty({
                color: Color.RED,
            });
        }
        (window as any).cesiumMap.flyTo(entities[0]);
    }

    /**
     * 删除线段绘制实体图层
     */
    public deleteEntityLineCesium() {
        if ((cesiumLayer as any).drawEntityCesium) {
            (window as any).cesiumMap.entities.remove((cesiumLayer as any).drawEntityCesium);
            (cesiumLayer as any).drawEntityCesium = null;
        }

        if (cesiumLayer.geoJsonLineCesium) {
            // 申明
            (window as any).cesiumMap.dataSources.remove(cesiumLayer.geoJsonLineCesium);
            cesiumLayer.geoJsonLineCesium = null;
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
            if (data.data.renderType === "entity") {
                await this.renderEntityLineCesium();
            }
            if (data.data.renderType === "geo") {
                await this.renderGeoLineCesium();
            }
            console.log('renderLine');
            break;
        case 'mouseRenderLine':
            console.log('mouseRenderLine');
            break;
        case 'deleteLine':
            await this.deleteEntityLineCesium();
            console.log('deleteLine');
            break;
        case 'close':
            console.log('11');
            break;
        }

    }

    /************************************  end  ***********************************************************/


    /************************************  Mapbox  ***********************************************************/

    /************************************  start  ***********************************************************/

    /**
     * mapbox 添加 线
     */
    public renderEntityLineMapBox() {
        console.log('绘制普通线');
    }

    /**
     * mapbox geo添加 线
     */
    public async renderGeoLineMapBox() {
        console.log('绘制geo');
        // 点数据构造成线数据
        // geoJson: GeoJsonHeader, position:
        const { geoJson, position } = await this.buildGeoJsonMapbox();
        console.log('删除线');
        console.log(geoJson);
        (window as any).mapboxMap.addSource('test-line-mapbox',{
            "type": "geojson",
            "data": geoJson
        });
        (window as any).mapboxMap.addLayer({
            "id": "test-line-mapbox",
            "type": "line",
            "source": 'test-line-mapbox',
            "layout": {
                "line-cap": "round",
                //"line-json": "round"
            },
            "paint": {
                "line-color": "red",
                "line-width": 6,
                "line-opacity": 0.5
            }
        });
        (window as any).mapboxMap.flyTo({
            center: position,
            zoom: 9,
            speed: 0.6,
            curve: 1,
            easing(t: any) {
                return t;
            }
        });
    }

    /**
     * 删除mapbox 图层
     */
    public async deleteEntityLineMapBox() {
        if ((window as any).mapboxMap && (window as any).mapboxMap.getLayer('test-line-mapbox')) {
            (window as any).mapboxMap.removeLayer('test-line-mapbox');
            (window as any).mapboxMap.removeSource('test-line-mapbox');
        }
    }
    /**
     * 地图事件
     * @param data
     */
    public async mapBoxMapEvent(data: any) {
        console.log(data);
        switch (data.action) {
        case 'renderLine':
            if (data.data.renderType === "entity") {
                await this.renderEntityLineMapBox();
            }
            if (data.data.renderType === "geo") {
                await this.renderGeoLineMapBox();
            }
            console.log('renderLine');
            break;
        case 'mouseRenderLine':
            console.log('mouseRenderLine');
            break;
        case 'deleteLine':
            await this.deleteEntityLineMapBox();
            console.log('deleteLine');
            break;
        case 'close':
            console.log('11');
            break;
        }

    }

    /************************************  end  ***********************************************************/

    /************************************  leaflet  ***********************************************************/

    /**
     * 地图事件
     * @param data
     */
    public async leafletMapEvent(data: any) {
        console.log(data);
        switch (data.action) {
        case 'renderLine':
            if (data.data.renderType === "entity") {
                await this.renderEntityLineLeaflet();
            }
            if (data.data.renderType === "geo") {
                await this.renderGeoLineLeaflet();
            }
            console.log('renderLine');
            break;
        case 'mouseRenderLine':
            console.log('mouseRenderLine');
            break;
        case 'deleteLine':
            await this.deleteEntityLineLeaflet();
            console.log('deleteLine');
            break;
        case 'close':
            console.log('11');
            break;
        }

    }

    /**
     * 绘制leaflet 线
     */
    public async renderEntityLineLeaflet() {
        const { data, position } = await this.buildLeafletLineData();
        cesiumLayer.polylineLeaflet = new Polyline(data, { color: 'red' })
            .addTo((window as any).leafletMap);
        console.log(cesiumLayer.polylineLeaflet);
        (window as any).leafletMap.setView(position, 11);
    }

    /**
     * 绘制leaflet 线  geo
     */
    public async renderGeoLineLeaflet() {
        const dataJson1: any = require('../../mock/line/geoJsonline.json');
        cesiumLayer.polylineLeafletGeoJson = geoJSON(dataJson1, {
            style: {
                color: 'red'
            }
        })
            .addTo((window as any).leafletMap);
        (window as any).leafletMap.flyTo([
            30.276858411864904,
            120.16433715820311,
        ], 11);
    }

    /**
     * 删除leaflet 线
     */
    public deleteEntityLineLeaflet() {
        console.log('删除线');
        if ((window as any).leafletMap && (window as any).leafletMap.hasLayer(cesiumLayer.polylineLeaflet)) {
            (window as any).leafletMap.removeLayer(cesiumLayer.polylineLeaflet);

        }
        if ((window as any).leafletMap && (window as any).leafletMap.hasLayer(cesiumLayer.polylineLeafletGeoJson)) {
            (window as any).leafletMap.removeLayer(cesiumLayer.polylineLeafletGeoJson);

        }
    }
    /************************************  start  ***********************************************************/
    /************************************  end  ***********************************************************/
    public beforeDestroy() {
        try {
            this.deleteEntityLineCesium();
            this.deleteEntityLineMapBox();
            this.deleteEntityLineLeaflet();
        }catch (e) {
            console.warn(e);
        }


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
