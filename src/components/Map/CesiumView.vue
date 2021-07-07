<template lang="pug">
    .map
        #cesium-container
        CesiumMarkerDialog(@map:event="mapEvent")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { CesiumInstanceOptions } from '@/map/type/CesiumType';
import {
    Cartesian3,
    EasingFunction,
    Viewer,
    PointGraphics,
    GeoJsonDataSource,
    Color,
    Math,
    Cartesian2,
    Entity,
    PointPrimitiveCollection,
} from 'cesium';
import CesiumService from '../../map/service/CesiumService';
import { ChangeLayerImageConfig } from '@/map/type/CommonType';
import CesiumMarkerDialog from '../../components/dialog/marker/CesiumMarkerDialog.vue';
// 普通实体
let normalIcon: Entity[] = [];
// 申明方式marker
let pointPrimitives: PointPrimitiveCollection | unknown;
// geoJson marker
let geoJsonMarker: unknown;

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
        const map: Viewer = await this.mapInstance.initMapInstance('CESIUM', { id: 'cesium-container' });
        console.log(map);


        // const amapOptions: ChangeLayerImageConfig = { style: 'elec', crs: 'WGS84' };
        // mapInstance.changeLayer('AMAP', amapOptions, map);
        const baiduOptions: ChangeLayerImageConfig = { style: 'vec', crs: 'BD09' };
        (window as any).cesiumMap = map;
        this.mapInstance.changeLayer('AMAP', baiduOptions, map);
        this.mapInstance.flyTo(((window as any).cesiumMap as any).camera, {
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

    /**
     * 渲染普通marker（實體集合）
     */
    public async renderNormalEntityListLayerMarker() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
        const markerList: Entity[] = [];
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const marker: Entity = this.mapInstance.createMarker({
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
    public async renderNormalPointPrimitiveCollectionLayerMarker() {
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
    public getCommonGeoJson(features = []) {
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
    public async buildGeoJson() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
        let GeoJsonHeader: any = this.getCommonGeoJson([]);
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
    public async renderNormalGeoJsonLayerMarker() {
        const geoJson = await this.buildGeoJson();
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
    public async renderClusterLayerMarker() {
        console.log('聚合点位渲染');
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
                        await this.renderNormalGeoJsonLayerMarker();
                        break;
                    case 2:
                        await this.renderNormalPointPrimitiveCollectionLayerMarker();
                        break;
                    case 1:
                        await this.renderNormalEntityListLayerMarker();
                        break;
                }
            }
            if (data.data.markerType === 2) {
                await this.renderClusterLayerMarker();
            }

        }
        if (data.action === 'CLEAR') {
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
