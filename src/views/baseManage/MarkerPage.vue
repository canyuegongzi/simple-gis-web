<template lang="pug">
    .pug-container
        CesiumMarkerDialog(@map:event="cesiumMapEvent" v-if="mapType === 'CESIUM'")
        MapboxMarkerDialog(@map:event="mapBoxMapEvent" v-else-if="mapType === 'MAPBOX'")
        LeafletMarkerDialog(@map:event="mapEventLeaflet" v-else-if="mapType === 'LEAFLET'")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { MapTypeEnum } from '@/map/type/CommonType';
import CesiumService from '@/map/service/CesiumService';
import LeafletService from '@/map/service/LeafletService';
import MapBoxService from '@/map/service/MapBoxService';
import CesiumMarkerDialog from '../../components/dialog/marker/CesiumMarkerDialog.vue';
import MapboxMarkerDialog from '../../components/dialog/marker/MapboxMarkerDialog.vue';
import LeafletMarkerDialog from '../../components/dialog/marker/LeafletMarkerDialog.vue';
import {
    Cartesian2,
    Cartesian3,
    Color,
    Entity,
    GeoJsonDataSource,
    PointGraphics,
    PointPrimitiveCollection,
} from 'cesium';
import { DivIcon, Icon } from 'leaflet';
import { Marker } from 'mapbox-gl';
import { CesiumClusterWidgets } from '../../map/service/cesium/widgets/CesiumClusterWidgets';

const appModule = namespace('appModule');

// 普通实体
let normalIcon: Entity[] = [];
// 申明方式marker
let pointPrimitives: PointPrimitiveCollection | unknown;
// geoJson marker
let geoJsonMarker: unknown;

@Component({
    components: {
        CesiumMarkerDialog,
        MapboxMarkerDialog,
        LeafletMarkerDialog,
    },
})
export default class MarkerPage extends Vue {

    public normalLayerMarkersMapBox: Marker[] = []; // 普通方式下的marker渲染
    public resourceMarkersMapBox = null; // 资源型的marker渲染
    public resourceLayerMapBox: any = null;
    public clusterLayerMapBox: any = null;  // 聚合图层

    public normalLayer3Leaflet: any = null;  // divicon marker
    public normalLayer1Leaflet: any = null;  // 普通圆圈
    public normalLayer2Leaflet: any = null;  // icon
    public normalLayer4Leaflet: any = null;  // 聚合图层
    public normalLayer5Leaflet: any = null;  // 聚合图层
    public normalLayer6Leaflet: any = null;  // 聚合图层
    public cesiumClusterWidgets: CesiumClusterWidgets | null = null;

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
     * 渲染普通marker（實體集合）
     */
    public async renderNormalEntityListLayerMarkerCesium() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
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
            normalIcon.push(marker);
            (window as any).cesiumMap.entities.add(marker);
        }
        return markerList;
    }

    /**
     * 渲染普通marker（申明方式）
     */
    public async renderNormalPointPrimitiveCollectionLayerMarkerCesium() {
        pointPrimitives = (window as any).cesiumMap.scene.primitives.add(new PointPrimitiveCollection());
        const dataJson: any[] = await import('../../mock/stationList1.json');
        const markerList: Entity[] = [];
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            (pointPrimitives as PointPrimitiveCollection).add({
                pixelSize: 5,
                color: Color['BLUE'],
                outlineColor: Color.BLACK,
                outlineWidth: 0,
                position: Cartesian3.fromDegrees(longitude, latitude),
            });
        }
        return markerList;
    }

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
        const dataJson: any[] = await import('../../mock/stationList1.json');
        let GeoJsonHeader: any = this.getCommonGeoJsonCesium([]);
        for (let i = 0; i < dataJson.length; i++) {
            const point = { ...dataJson[i] };
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            let featureItem = {
                type: 'Feature',
                properties: { ...point },
                geometry: { type: 'Point', coordinates: [longitude, latitude, 0] },
            };
            GeoJsonHeader.features.push(featureItem);
        }
        return GeoJsonHeader;
    }

    /**
     * 渲染普通marker（geoJson）
     */
    public async renderNormalGeoJsonLayerMarkerCesium() {
        const geoJson = await this.buildGeoJsonCesium();
        const geoJsonResource = await GeoJsonDataSource.load(geoJson);
        geoJsonMarker = await (window as any).cesiumMap.dataSources.add(geoJsonResource);
        const entities = geoJsonResource.entities.values;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            entity.billboard = undefined;
            entity.point = new PointGraphics({
                color: Color.RED,
                pixelSize: 10,
            });
        }
    }

    /**
     * 渲染聚合 marker
     */
    public async renderClusterLayerMarkerCesium() {
        const geoJson = await this.buildGeoJsonCesium();
        this.cesiumClusterWidgets = new CesiumClusterWidgets({
            viewer: (window as any).cesiumMap,
            data: geoJson,
            selectedEntity: this.cesiumClusterWidgetsSelect,
        });
    }

    /**
     * 点位选择
     */
    public cesiumClusterWidgetsSelect(e: any) {
        console.log('这是marker页面');
        console.log(e);
    }

    /**
     * 地图事件
     * @param data
     */
    public async cesiumMapEvent(data: any) {
        console.log(data);
        if (data.action === 'MARKER') {
            let markerList = [];
            // 普通marker
            if (data.data.markerType === 1) {
                switch (data.data.styleType) {
                case 3:
                    await this.renderNormalGeoJsonLayerMarkerCesium();
                    break;
                case 2:
                    await this.renderNormalPointPrimitiveCollectionLayerMarkerCesium();
                    break;
                case 1:
                    await this.renderNormalEntityListLayerMarkerCesium();
                    break;
                }
            }
            if (data.data.markerType === 2) {
                await this.renderClusterLayerMarkerCesium();
            }

        }
        if (data.action === 'CLEAR') {
            this.cesiumResetMap();

        }

    }

    /**
     * cesium 清空
     */
    public cesiumResetMap() {
        try {
            // 普通
            for (let i = 0; i < normalIcon.length; i++) {
                (window as any).cesiumMap.entities.remove(normalIcon[i]);
            }
            normalIcon = [];
            if (pointPrimitives) {
                // 申明
                (window as any).cesiumMap.scene.primitives.remove(pointPrimitives);
                pointPrimitives = undefined;
            }

            if (geoJsonMarker) {
                // 申明
                (window as any).cesiumMap.dataSources.remove(geoJsonMarker);
                geoJsonMarker = undefined;
            }

            // 聚合组件销毁
            if (this.cesiumClusterWidgets) {
                this.cesiumClusterWidgets.destroy();
                this.cesiumClusterWidgets = null;
            }
        } catch (e) {
            console.warn(e);
        }

    }

    /************************************  end  ***********************************************************/

    /************************************  MAPBOX  ***********************************************************/

    /************************************  start  ***********************************************************/
    /**
     * 渲染普通marker（图层方式）
     */
    public async renderNormalLayerMarkerMapBox() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
        const markerList: any[] = [];
        for (let i = 0; i < dataJson.length; i++) {
            if (markerList.length > 50) {
                break;
            }
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const marker: Marker = this.mapBoxMapInstance.createMarker();
            marker.setLngLat([longitude, latitude]);
            marker.addTo((window as any).mapboxMap);
            markerList.push(marker);
        }
        return markerList;
    }

    /**
     * 渲染资源型marker
     */
    public async renderResourceMarkerMapBox() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
        await this.mapBoxMapInstance.loadImages({
            site5: require('../../assets/map/site-5.png'),
        }, (window as any).mapboxMap);
        const sourceId: string = 'test-source';
        let jsonData = this.buildGeoJSONDataMapBox(dataJson, '1');
        await this.mapBoxMapInstance.addSourceToMap(sourceId, jsonData, (window as any).mapboxMap);
        return await this.mapBoxMapInstance.renderMarkerLayer(
            {
                id: 'test-layer',
                type: 'symbol',
                source: sourceId,
                filter: ['==', 'typeCode', '1'],
                layout: {
                    'icon-image': '{symbolImgName}', //图片的source
                    'icon-size': 0.8,
                    'icon-ignore-placement': true, //忽略碰撞检测
                    visibility: 'visible',
                },
            },
            (window as any).mapboxMap,
        );
    }

    /**
     * 渲染聚合型marker
     */
    public async renderClusterMarkerMapBox() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
        await this.mapBoxMapInstance.loadImages({
            site5: require('../../assets/map/site-5.png'),
        }, (window as any).mapboxMap);
        let jsonData = this.buildGeoJSONDataMapBox(dataJson, '1');
        const { clusterName, layerName } = await this.mapBoxMapInstance.renderClusterMakerLayer({
            jsonData: jsonData,
            clusterName: 'eventLayer_test',
            clusterColor: 'blue',
            getCircleStyle: {
                'circle-radius': 8,
                'circle-color': 'red',
            },
            unClusterLayerStyle: {},
            clusterCountLayerStyle: {},
            // clusterProperties: { sum: ['+', ['get', 'total']] },
            // clusterProperties: { sum: ['+', ['to-number', ['get', 'total']]] },
            layoutText: {
                'text-field': '{point_count}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
                'icon-ignore-placement': true,
            },
        }, (window as any).mapboxMap);

        if (layerName) {
            this.mapBoxMapInstance.clusterMakerClickCallback(clusterName, layerName, (window as any).mapboxMap, this.clusterMarkerClickFunMapBox);
        }
        if (clusterName) {
            this.clusterLayerMapBox = clusterName;
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
     * 图层点击事件
     */
    public clusterMarkerClickFunMapBox(coordinates: any, info: any, clusterName: any) {
        console.log(info);
    }

    /**
     * 地图事件
     * @param data
     */
    public async mapBoxMapEvent(data: any) {
        if (data.action === 'MARKER') {
            // 普通marker
            if (data.data.markerType === 1) {
                switch (data.data.styleType) {
                case 2:
                    const LayerId = await this.renderResourceMarkerMapBox();
                    if (LayerId) {
                        this.resourceLayerMapBox = LayerId;
                    }
                    break;
                case 1:
                    // 图层渲染
                    this.normalLayerMarkersMapBox = await this.renderNormalLayerMarkerMapBox();
                    break;
                }
            }
            // 聚合点位
            if (data.data.markerType === 2) {
                await this.renderClusterMarkerMapBox();
            }

        }
        if (data.action === 'CLEAR') {
            this.mapBoxResetMap();
        }
    }

    /**
     * 清楚mapbox 点位
     */
    public mapBoxResetMap() {
        try {
            // 清空普通marker渲染的marker
            for (let i = 0; i < this.normalLayerMarkersMapBox.length; i++) {
                this.normalLayerMarkersMapBox[i].remove();
            }
            this.normalLayerMarkersMapBox = [];
            if (this.resourceLayerMapBox && (window as any).mapboxMap.getLayer(this.resourceLayerMapBox)) {
                (window as any).mapboxMap.removeLayer(this.resourceLayerMapBox);
                this.resourceLayerMapBox = null;
            }
            // 清楚聚合图层
            this.mapBoxMapInstance.removeClusterLayer(this.clusterLayerMapBox, (window as any).mapboxMap);
        } catch (e) {
            console.warn(e);
        }


    }

    /************************************  end  ***********************************************************/

    /************************************  Leaflet  ***********************************************************/

    /************************************  start  ***********************************************************/
    /**
     * 渲染普通小圆点
     */
    public async renderNormalCircleMarkerLeaflet() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
        const icon: Icon = this.leafletMapInstance.createIcon({
            iconUrl: '../../assets/map/site.png',
        });
        console.log(icon);
        const markerList: any[] = [];
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const marker: any = this.leafletMapInstance.renderCircleMarker([latitude, longitude], {
                radius: 8,
            });
            markerList.push(marker);
        }
        return markerList;
    }

    /**
     * 渲染icon  marker
     */
    public async renderNormalIconMarkerLeaflet() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
        const markerList: any[] = [];
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const icon: Icon = this.leafletMapInstance.createIcon({
                iconUrl: require('../../assets/map/site.png'),
            });
            const marker: any = this.leafletMapInstance.createMarker([latitude, longitude], {
                icon: icon,
            });
            markerList.push(marker);
        }
        return markerList;
    }

    /**
     * 渲染divIcon  marker
     */
    public async renderNormalDivIconMarkerLeaflet() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
        const markerList: any[] = [];
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const icon: DivIcon = this.leafletMapInstance.createDivIon({
                html: `
                        <div class="leaflet-icon-item">
                          <span>${i}</span>
                        </div>
                      `,
                className: 'leaflet-div-icon',
            });
            const marker: any = this.leafletMapInstance.createMarker([latitude, longitude], {
                icon: icon,
            });
            markerList.push(marker);
        }
        return markerList;
    }

    /**
     * 地图事件
     * @param data
     */
    public async mapEventLeaflet(data: any) {
        console.log(data);
        if (data.action === 'MARKER') {
            let markerList = [];
            // 普通marker
            if (data.data.markerType === 1) {
                switch (data.data.styleType) {
                case 3:
                    markerList = await this.renderNormalCircleMarkerLeaflet();
                    this.normalLayer3Leaflet = this.leafletMapInstance.renderMarkerToGroupLayer((window as any).leafletMap, markerList);
                    break;
                case 2:
                    markerList = await this.renderNormalDivIconMarkerLeaflet();
                    this.normalLayer2Leaflet = this.leafletMapInstance.renderMarkerToGroupLayer((window as any).leafletMap, markerList);
                    break;
                case 1:
                    markerList = await this.renderNormalIconMarkerLeaflet();
                    this.normalLayer1Leaflet = this.leafletMapInstance.renderMarkerToGroupLayer((window as any).leafletMap, markerList);
                    break;
                }
            }
            if (data.data.markerType === 2) {
                switch (data.data.styleType) {
                case 3:
                    markerList = await this.renderNormalCircleMarkerLeaflet();
                    this.normalLayer4Leaflet = this.leafletMapInstance.leafletMarkerCluster.createClusterMarker(markerList);
                    (window as any).leafletMap.addLayer(this.normalLayer4Leaflet);
                    break;
                case 2:
                    markerList = await this.renderNormalDivIconMarkerLeaflet();
                    this.normalLayer5Leaflet = this.leafletMapInstance.leafletMarkerCluster.createClusterMarker(markerList);
                    (window as any).leafletMap.addLayer(this.normalLayer5Leaflet);
                    break;
                case 1:
                    markerList = await this.renderNormalIconMarkerLeaflet();
                    this.normalLayer6Leaflet = this.leafletMapInstance.leafletMarkerCluster.createClusterMarker(markerList);
                    (window as any).leafletMap.addLayer(this.normalLayer6Leaflet);
                    break;
                }
            }

        }
        if (data.action === 'CLEAR') {
            this.leafletResetMap();
        }

    }

    /**
     * leaflet 请除点位
     */
    public leafletResetMap() {
        try {
            if ((window as any).leafletMap.hasLayer(this.normalLayer1Leaflet)) {
                (window as any).leafletMap.removeLayer(this.normalLayer1Leaflet);

            }
            if ((window as any).leafletMap.hasLayer(this.normalLayer3Leaflet)) {
                (window as any).leafletMap.removeLayer(this.normalLayer3Leaflet);

            }
            if ((window as any).leafletMap.hasLayer(this.normalLayer2Leaflet)) {
                (window as any).leafletMap.removeLayer(this.normalLayer2Leaflet);

            }
            if ((window as any).leafletMap.hasLayer(this.normalLayer4Leaflet)) {
                (window as any).leafletMap.removeLayer(this.normalLayer4Leaflet);

            }
            if ((window as any).leafletMap.hasLayer(this.normalLayer5Leaflet)) {
                (window as any).leafletMap.removeLayer(this.normalLayer5Leaflet);

            }
            if ((window as any).leafletMap.hasLayer(this.normalLayer6Leaflet)) {
                (window as any).leafletMap.removeLayer(this.normalLayer6Leaflet);

            }
        } catch (e) {
            console.warn(e);
        }


    }

    /************************************  end  ***********************************************************/

    public beforeDestroy() {
        try {
            this.cesiumResetMap();
            this.mapBoxResetMap();
            this.leafletResetMap();
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
