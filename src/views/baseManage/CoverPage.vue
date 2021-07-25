<template lang="pug">
    .pug-container
        CesiumCoverDialog(@map:event="cesiumMapEvent" v-if="mapType === 'CESIUM'")
        MapboxCoverDialog(@map:event="mapBoxMapEvent" v-if="mapType === 'MAPBOX'")
        LeafletCoverDialog(@map:event="leafletMapEvent" v-if="mapType === 'LEAFLET'")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
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
    LabelStyle, VerticalOrigin, HorizontalOrigin,
} from 'cesium';
import { geoJSON, Polygon, Polyline } from 'leaflet';
import CesiumCoverDialog from '../../components/dialog/cover/CesiumCoverDialog.vue';
import LeafletCoverDialog from '../../components/dialog/cover/LeafletCoverDialog.vue';
import MapboxCoverDialog from '../../components/dialog/cover/MapboxCoverDialog.vue';
const appModule = namespace('appModule');

const cesiumLayer: any = {
    drawEntityCesium: null,  // cesium 线断实体
    geoJsonCoverCesium: null,
    geoJsonCoverMapBox: null,
    polygonLeaflet: null,
    coverLeafletGeoJson: null
};
const geoJson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            120.08511543273926,
                            30.865762703102323
                        ],
                        [
                            120.09713172912596,
                            30.870625105172156
                        ],
                        [
                            120.08708953857422,
                            30.86966737881701
                        ],
                        [
                            120.07876396179198,
                            30.86627842410542
                        ],
                        [
                            120.07721900939941,
                            30.861563157373602
                        ],
                        [
                            120.07842063903809,
                            30.855816112502538
                        ],
                        [
                            120.08254051208496,
                            30.85087927333077
                        ],
                        [
                            120.0857162475586,
                            30.84822653838007
                        ],
                        [
                            120.09507179260254,
                            30.848005473822894
                        ],
                        [
                            120.09979248046874,
                            30.851026645343705
                        ],
                        [
                            120.09979248046874,
                            30.860384304455117
                        ],
                        [
                            120.10133743286133,
                            30.86657312057582
                        ],
                        [
                            120.08511543273926,
                            30.865762703102323
                        ]
                    ]
                ]
            }
        }
    ]
};

@Component({
    components: {
        CesiumCoverDialog,
        MapboxCoverDialog,
        LeafletCoverDialog
    }
})
export default class CoverPage extends Vue {
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
            properties: { id: 'test-Polygon' },
            geometry: {
                type: "Polygon",
                coordinates: []
            },
        };
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            featureItem.geometry.coordinates.push([longitude, latitude]);
        }
        GeoJsonHeader.features.push(featureItem);
        return GeoJsonHeader;
    }

    /**
     * 拼裝geoJson
     */
    public async buildGeoJsonMapbox() {
        /*const dataJson: any[] = await import('../../mock/line/stationList1.json');
        let GeoJsonHeader: any = await this.getCommonGeoJsonCesium([]);
        let featureItem: any = {
            type: 'Feature',
            properties: { id: 'test-Polygon' },
            geometry: {
                type: "Polygon",
                coordinates: []
            },
        };
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            featureItem.geometry.coordinates.push([longitude, latitude]);
        }
        GeoJsonHeader.features.push(featureItem);*/
        return { geoJson: geoJson, position: geoJson.features[0].geometry.coordinates[0] };
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
     * 渲染 cesium 实体 的面
     */
    public async renderEntityCoverCesium() {
        this.deleteEntityCoverCesium();
        const positionList: number[] = [];
        const dataJson: any[] = await import('../../mock/line/stationList1.json');
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            positionList.push(longitude);
            positionList.push(latitude);
        }
        const drawEntity: Entity = new Entity({
            name: '面数据',
            polygon: {
                // @ts-ignore
                hierarchy: Cartesian3.fromDegreesArray(positionList),
                outline: false,
                perPositionHeight: true, //允许三角形使用点的高度
                material: Color.RED.withAlpha(0.4)
            },
            label: {
                text: '实体面数据',  //文本
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
    public async renderGeoCoverCesium() {
        this.deleteEntityCoverCesium();
        // 点数据构造成线数据
        /// const geoJson = await this.buildGeoJsonCesium();
        console.log(geoJson);
        const geoJsonResource = await GeoJsonDataSource.load(geoJson);
        cesiumLayer.geoJsonCoverCesium = await (window as any).cesiumMap.dataSources.add(geoJsonResource);
        const entities = geoJsonResource.entities.values;
        console.log(entities);
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            entity.billboard = undefined;
            (entity as any).nameID  = `${i}-test-polygon`;
            (entity as any).polygon.perPositionHeight = true; //允许三角形使用点的高度
            (entity as any).polygon.material = Color.RED.withAlpha(0.4);
        }
        (window as any).cesiumMap.flyTo(entities[0]);
    }

    /**
     * 删除线段绘制实体图层
     */
    public deleteEntityCoverCesium() {
        if ((cesiumLayer as any).drawEntityCesium) {
            (window as any).cesiumMap.entities.remove((cesiumLayer as any).drawEntityCesium);
            (cesiumLayer as any).drawEntityCesium = null;
        }

        if (cesiumLayer.geoJsonCoverCesium) {
            // 申明
            (window as any).cesiumMap.dataSources.remove(cesiumLayer.geoJsonCoverCesium);
            cesiumLayer.geoJsonCoverCesium = null;
        }

    }

    /**
     * 地图事件
     * @param data
     */
    public async cesiumMapEvent(data: any) {
        switch (data.action) {
        case 'renderLine':
            if (data.data.renderType === "entity") {
                await this.renderEntityCoverCesium();
            }
            if (data.data.renderType === "geo") {
                await this.renderGeoCoverCesium();
            }
            break;
        case 'mouseRenderLine':
            break;
        case 'deleteLine':
            await this.deleteEntityCoverCesium();
            break;
        case 'close':
            break;
        }

    }

    /************************************  end  ***********************************************************/


    /************************************  Mapbox  ***********************************************************/

    /************************************  start  ***********************************************************/

    /**
     * mapbox 添加 线
     */
    public renderEntityCoverMapBox() {
        console.log('绘制普通线');
    }

    /**
     * mapbox geo添加 线
     */
    public async renderGeoCoverMapBox() {
        console.log('绘制geo');
        // 点数据构造成线数据
        // geoJson: GeoJsonHeader, position:
        const { geoJson, position } = await this.buildGeoJsonMapbox();
        console.log('删除线');
        console.log(geoJson);
        (window as any).mapboxMap.addSource('test-polygon-mapbox',{
            "type": "geojson",
            "data": geoJson
        });
        (window as any).mapboxMap.addLayer({
            "id": "test-polygon-mapbox",
            "type": "fill",
            "source": 'test-polygon-mapbox',
            'layout': {},
            'paint': {
                'fill-color': 'red',
                'fill-opacity': 0.8
            }
        });
        console.log(position[0]);
        (window as any).mapboxMap.flyTo({
            center: { lng: position[0][0], lat: position[0][1] },
            zoom: 12,
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
    public async deleteEntityCoverMapBox() {
        if ((window as any).mapboxMap && (window as any).mapboxMap.getLayer('test-polygon-mapbox')) {
            (window as any).mapboxMap.removeLayer('test-polygon-mapbox');
            (window as any).mapboxMap.removeSource('test-polygon-mapbox');
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
                await this.renderEntityCoverMapBox();
            }
            if (data.data.renderType === "geo") {
                await this.renderGeoCoverMapBox();
            }
            console.log('renderLine');
            break;
        case 'mouseRenderLine':
            console.log('mouseRenderLine');
            break;
        case 'deleteLine':
            await this.deleteEntityCoverMapBox();
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
                await this.renderEntityCoverLeaflet();
            }
            if (data.data.renderType === "geo") {
                await this.renderGeoCoverLeaflet();
            }
            console.log('renderLine');
            break;
        case 'mouseRenderLine':
            console.log('mouseRenderLine');
            break;
        case 'deleteLine':
            await this.deleteEntityCoverLeaflet();
            console.log('deleteLine');
            break;
        case 'close':
            console.log('11');
            break;
        }

    }

    /**
     * 绘制leaflet 面
     */
    public async renderEntityCoverLeaflet() {
        const { data, position } = await this.buildLeafletLineData();
        cesiumLayer.polygonLeaflet = new Polygon(data, { color: '#000eff',fillColor: '#0000ed', weight: 1 })
            .addTo((window as any).leafletMap);
        console.log(cesiumLayer.polygonLeaflet);
        (window as any).leafletMap.setView(position, 11);
    }

    /**
     * 绘制leaflet 线
     */
    public async renderGeoCoverLeaflet() {
        const data: any = await import('../../mock/polygon/mockPolygon.json');
        cesiumLayer.coverLeafletGeoJson = geoJSON(data, {
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
    public deleteEntityCoverLeaflet() {
        console.log('删除面');
        if ((window as any).leafletMap && (window as any).leafletMap.hasLayer(cesiumLayer.polygonLeaflet)) {
            (window as any).leafletMap.removeLayer(cesiumLayer.polygonLeaflet);

        }

        if ((window as any).leafletMap && (window as any).leafletMap.hasLayer(cesiumLayer.coverLeafletGeoJson)) {
            (window as any).leafletMap.removeLayer(cesiumLayer.coverLeafletGeoJson);

        }
    }
    /************************************  start  ***********************************************************/
    /************************************  end  ***********************************************************/
    public beforeDestroy() {
        try {
            this.deleteEntityCoverCesium();
            this.deleteEntityCoverMapBox();
            this.deleteEntityCoverLeaflet();
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
