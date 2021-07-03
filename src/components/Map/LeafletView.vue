<template lang="pug">
    .map
        #leaflet-container
        LeafletMarkerDialog(@map:event="mapEvent")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LeafletService from '../../map/service/LeafletService';
import { LeafletInstanceOptions } from '@/map/type/LeafletType';
import { ChangeLayerImageConfig } from '@/map/type/CommonType';
import LeafletMarkerDialog from '../../components/dialog/marker/LeafletMarkerDialog.vue';
import { DivIcon, Icon } from 'leaflet';

@Component({
    components: {
        LeafletMarkerDialog,
    },
})
export default class LeafletView extends Vue {
    public mapInstance: LeafletService;
    public normalLayer3: any = null;  // divicon marker
    public normalLayer1: any = null;  // 普通圆圈
    public normalLayer2: any = null;  // icon
    public normalLayer4: any = null;  // 聚合图层
    public normalLayer5: any = null;  // 聚合图层
    public normalLayer6: any = null;  // 聚合图层

    public async initMap() {
        const leafletProps: LeafletInstanceOptions = {
            id: 'leaflet-container',
        };
        this.mapInstance = new LeafletService(leafletProps);
        const baiduOptions: ChangeLayerImageConfig = { style: 'vec', crs: 'BD09' };
        const map: any = await this.mapInstance.initMapInstance('LEAFLET', { id: 'leaflet-container' });
        (window as any).leafletMap = map;
        // mapInstance.renderHtmlMarker('', [30, 120], map);
        // 画圆marker
        this.mapInstance.changeLayer('天地图', baiduOptions, map);
        return map;
    }

    /**
     * 渲染普通小圆点
     */
    public async renderNormalCircleMarker() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
        const icon: Icon = this.mapInstance.createIcon({
            iconUrl: '../../assets/map/site.png',
        });
        console.log(icon);
        const markerList: any[] = [];
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const marker: any = this.mapInstance.renderCircleMarker([latitude, longitude], {
                radius: 8,
            });
            markerList.push(marker);
        }
        return markerList;
    }

    /**
     * 渲染icon  marker
     */
    public async renderNormalIconMarker() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
        const markerList: any[] = [];
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const icon: Icon = this.mapInstance.createIcon({
                iconUrl: require('../../assets/map/site.png'),
            });
            const marker: any = this.mapInstance.createMarker([latitude, longitude], {
                icon: icon,
            });
            markerList.push(marker);
        }
        return markerList;
    }

    /**
     * 渲染divIcon  marker
     */
    public async renderNormalDivIconMarker() {
        const dataJson: any[] = await import('../../mock/stationList1.json');
        const markerList: any[] = [];
        for (let i = 0; i < dataJson.length; i++) {
            const latitude = parseFloat(dataJson[i].latitude);
            const longitude = parseFloat(dataJson[i].longitude);
            const icon: DivIcon = this.mapInstance.createDivIon({
                html: `
                        <div class="leaflet-icon-item">
                          <span>${i}</span>
                        </div>
                      `,
                className: 'leaflet-div-icon',
            });
            const marker: any = this.mapInstance.createMarker([latitude, longitude], {
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
    public async mapEvent(data: any) {
        console.log(data);
        if (data.action === 'MARKER') {
            let markerList = [];
            // 普通marker
            if (data.data.markerType === 1) {
                switch (data.data.styleType) {
                    case 3:
                        markerList = await this.renderNormalCircleMarker();
                        this.normalLayer3 = this.mapInstance.renderMarkerToGroupLayer((window as any).leafletMap, markerList);
                        break;
                    case 2:
                        markerList = await this.renderNormalDivIconMarker();
                        this.normalLayer2 = this.mapInstance.renderMarkerToGroupLayer((window as any).leafletMap, markerList);
                        break;
                    case 1:
                        markerList = await this.renderNormalIconMarker();
                        this.normalLayer1 = this.mapInstance.renderMarkerToGroupLayer((window as any).leafletMap, markerList);
                        break;
                }
            }
            if (data.data.markerType === 2) {
                switch (data.data.styleType) {
                    case 3:
                        markerList = await this.renderNormalCircleMarker();
                        this.normalLayer4 = this.mapInstance.leafletMarkerCluster.createClusterMarker(markerList);
                        (window as any).leafletMap.addLayer(this.normalLayer4);
                        break;
                    case 2:
                        markerList = await this.renderNormalDivIconMarker();
                        this.normalLayer5 = this.mapInstance.leafletMarkerCluster.createClusterMarker(markerList);
                        (window as any).leafletMap.addLayer(this.normalLayer5);
                        break;
                    case 1:
                        markerList = await this.renderNormalIconMarker();
                        this.normalLayer6 = this.mapInstance.leafletMarkerCluster.createClusterMarker(markerList);
                        (window as any).leafletMap.addLayer(this.normalLayer6);
                        break;
                }
            }

        }
        if (data.action === 'CLEAR') {
            if ((window as any).leafletMap.hasLayer(this.normalLayer1)) {
                (window as any).leafletMap.removeLayer(this.normalLayer1);

            }
            if ((window as any).leafletMap.hasLayer(this.normalLayer3)) {
                (window as any).leafletMap.removeLayer(this.normalLayer3);

            }
            if ((window as any).leafletMap.hasLayer(this.normalLayer2)) {
                (window as any).leafletMap.removeLayer(this.normalLayer2);

            }
            if ((window as any).leafletMap.hasLayer(this.normalLayer4)) {
                (window as any).leafletMap.removeLayer(this.normalLayer4);

            }
            if ((window as any).leafletMap.hasLayer(this.normalLayer5)) {
                (window as any).leafletMap.removeLayer(this.normalLayer5);

            }
            if ((window as any).leafletMap.hasLayer(this.normalLayer6)) {
                (window as any).leafletMap.removeLayer(this.normalLayer6);

            }
        }

    }
}
</script>

<style scoped lang="stylus">
.map
    height 100%
    width 100%

    #leaflet-container
        height 100%
        width 100%
        z-index 1
</style>
<style lang="stylus">
.leaflet-icon-item
    width: 28px;
    height: 28px;
    background: green;
    border-radius: 14px;
    line-height: 28px;
    text-align: center;
    color: #ffff;

.leaflet-div-icon
    background transparent;
    width: 0 !important
    height: 0 !important
    border-radius: 14px;
    line-height: 28px;
    text-align: center;
    color: #ffff;
</style>
