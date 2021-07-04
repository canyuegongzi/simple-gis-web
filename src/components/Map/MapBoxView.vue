<template lang="pug">
    .map
        #mapbox-container
        MapboxMarkerDialog(@map:event="mapEvent")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { MapBoxInstanceOptions } from '@/map/type/MapBoxType';
import MapBoxService from '../../map/service/MapBoxService';
import MapboxMarkerDialog from '../../components/dialog/marker/MapboxMarkerDialog.vue';
import { Icon } from 'leaflet';
import { Marker } from 'mapbox-gl';

@Component({
    components: {
        MapboxMarkerDialog,
    },
})
export default class MapBoxView extends Vue {
    public mapInstance: MapBoxService;
    public normalLayerMarkers: Marker[] = []; // 普通方式下的marker渲染
    public resourceMarkers = null; // 资源型的marker渲染
    public resourceLayer: any = null;

    public async initMap() {
        const mapboxProps: MapBoxInstanceOptions = {
            id: 'mapbox-container',
        };
        this.mapInstance = new MapBoxService(mapboxProps);
        const map: any = await this.mapInstance.initMapInstance('MAPBOX', { id: 'mapbox-container' });
        (window as any).mapboxMap = map;
        return map;
    }

    /**
     * 渲染普通marker（图层方式）
     */
    public async renderNormalLayerMarker() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
        const markerList: any[] = [];
        for (let i = 0; i < dataJson.length; i++) {
            if (markerList.length > 50) {
                break;
            }
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const marker: Marker = this.mapInstance.createMarker();
            marker.setLngLat([longitude, latitude]);
            marker.addTo((window as any).mapboxMap);
            markerList.push(marker);
        }
        return markerList;
    }

    /**
     * 渲染资源型marker
     */
    public async renderResourceMarker() {

    }

    /**
     * 构造GeoJSON数据，给每个属性增加symbolName字段（该字段用于匹配图标）
     * @param dataList
     * @param code
     * @returns {*}
     */
    public buildGeoJSONData(dataList: any[], code: string) {
        let GeoJsonHeader: any = this.mapInstance.getCommonGeoJson();
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
     * 地图事件
     * @param data
     */
    public async mapEvent(data: any) {
        console.log('地图事件', data);
        console.log(data);
        if (data.action === 'MARKER') {
            // 普通marker
            if (data.data.markerType === 1) {
                switch (data.data.styleType) {
                    case 2:
                        const dataJson: any[] = await import('../../mock/stationList1.json');
                        await this.mapInstance.loadImages({
                            site5: require('../../assets/map/site-5.png'),
                        }, (window as any).mapboxMap);
                        const sourceId: string = 'test-source';
                        let jsonData = this.buildGeoJSONData(dataJson, '1');
                        await this.mapInstance.addSourceToMap(sourceId, jsonData, (window as any).mapboxMap);
                        let LayerId = await this.mapInstance.renderMapLayer(
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
                        if (LayerId) {
                            this.resourceLayer = LayerId;
                        }
                        break;
                    case 1:
                        // 图层渲染
                        this.normalLayerMarkers = await this.renderNormalLayerMarker();
                        break;
                }
            }
            // 聚合系统
            if (data.data.markerType === 2) {
                console.log('聚合');
            }

        }
        if (data.action === 'CLEAR') {
            // 清空普通marker渲染的marker
            for (let i = 0; i < this.normalLayerMarkers.length; i++) {
                this.normalLayerMarkers[i].remove();
            }
            this.normalLayerMarkers = [];
            if (this.resourceLayer && (window as any).mapboxMap.getLayer(this.resourceLayer)) {
                (window as any).mapboxMap.removeLayer(this.resourceLayer);
                this.resourceLayer = null;
            }

        }
    }
}
</script>

<style scoped lang="stylus">
.map
    height 100%
    width 100%

#mapbox-container
    height 100%
    width 100%
    z-index 1
</style>
