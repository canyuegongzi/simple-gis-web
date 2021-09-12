<template lang="pug">
    .pug-container()
        MigrationMapDialog(@map:event="mapEvent")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { MapTypeEnum } from '@/map/type/CommonType';
import CesiumService from '@/map/service/CesiumService';
import LeafletService from '@/map/service/LeafletService';
import MapBoxService from '@/map/service/MapBoxService';
import MigrationMapDialog from '../../components/dialog/migrationMap/MigrationMapDialog.vue';
const responseData = require('../../mock/qianxitu/solid.js');
const appModule = namespace('appModule');
import CesiumEchartsLayer from '../../map/service/cesium/plugin/echarts/EchartsLayer';

let layers: any = {
    mapboxMigrationMap: null, // mapbox 迁徙图
    mapboxEchartsLayer: null,
    leafletEchartsLayer: null,
    cesiumEchartsLayer: null,
};

const L = window.L;

@Component({
    name: 'MigrationMapPage',
    components: {
        MigrationMapDialog
    }
})
export default class MigrationMapPage extends Vue {
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
     * 判断坐标是否在中国内
     */
    public checkTransferCoordinate(coordinates: any) {
        if (73.66 <= coordinates[0] && coordinates[0] <= 135.05 && 3.86 <= coordinates[1] && coordinates[1] <= 53.55) {
            return true;
        }
        return false;
    }

    /**
     * 事件处置
     * @param data
     */
    public mapEvent(data: any) {
        switch (data.action) {
        case 'render':
            if (this.mapType === 'CESIUM') {
                if (data.data.dataType === 'SOLID') {
                    return this.renderCesiumEchartsSolidLayer();
                }
                return;
            }
            if (this.mapType === 'MAPBOX') {
                if (data.data.dataType === 'SOLID') {
                    return this.renderMapboxEchartsSolidLayer();
                }
                return;
            }
            if (this.mapType === 'LEAFLET') {
                if (data.data.dataType === 'SOLID') {
                    return this.renderLeafletEchartsSolidLayer();
                }
                return;
            }
            break;
        case 'delete':
            if (this.mapType === 'CESIUM') {
                if (data.data.dataType === 'SOLID') {
                    return this.deleteCesiumEchartsSolidLayer();
                }
                return;
            }
            if (this.mapType === 'MAPBOX') {
                if (data.data.dataType === 'SOLID') {
                    return this.deleteMapboxEchartsSolidLayer();
                }
                return;
            }
            if (this.mapType === 'LEAFLET') {
                if (data.data.dataType === 'SOLID') {
                    return this.deleteLeafletEchartsSolidLayer();
                }
                return;
            }
        }
    }

    /************************************  Cesium  ***********************************************************/
    /**
     * 渲染 cesium 固废图层 echarts 渲染
     */
    public async renderCesiumEchartsSolidLayer() {
        console.log('cesium 渲染迁徙图');
        console.log('渲染固废图层');
        const res = responseData.default;
        let routes: any = {};
        res.forEach((d: any, idx: any) => {
            if (this.checkTransferCoordinate(d.produce.coordinates) && this.checkTransferCoordinate(d.disposal.coordinates)) {
                let key = d.produce.name + '-' + d.disposal.name;
                if (!routes[key]) {
                    routes[key] = {
                        code: d.code,
                        fromName: d.produce.name,
                        toName: d.disposal.name,
                        coords: [d.produce.coordinates, d.disposal.coordinates],
                        codes: [d.code],
                    };
                } else {
                    routes[key].codes.push(d.code);
                }
            } else {
                res.splice(idx, 1);
            }
        });
        let routeData = Object.values(routes);
        let option = {
            GLMap: {
                roam: true,
            },
            animation: false, //取消动画效果
            coordinateSystem: 'GLMap',
            geo: {
                map: 'GLMap',
                label: {
                    emphasis: {
                        show: false,
                    },
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#404a59',
                    },
                    emphasis: {
                        areaColor: '#2a333d',
                    },
                },
            },
            series: [
                {
                    coordinateSystem: 'GLMap',
                    type: 'lines',
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: '#a6c84c',
                        symbolSize: 5,
                        constantSpeed: 25,
                    },
                    lineStyle: {
                        normal: {
                            color: '#a6c84c',
                            width: 0,
                            curveness: 0.2,
                        },
                    },
                    data: routeData,
                },
                {
                    coordinateSystem: 'GLMap',
                    type: 'lines',
                    zlevel: 2,
                    lineStyle: {
                        normal: {
                            color: '#30D385',
                            width: 1,
                            curveness: 0.2,
                        },
                    },
                    data: routeData,
                    blendMode: 'lighter',
                },
                {
                    name: 'produce',
                    type: 'scatter',
                    coordinateSystem: 'GLMap',
                    zlevel: 2,
                    showEffectOn: 'render',
                    data: routeData.map(function(dataItem: any) {
                        return {
                            name: dataItem.fromName,
                            value: dataItem.coords[0],
                        };
                    }),
                    symbolSize: 10,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false,
                        },
                        emphasis: {
                            show: true,
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: '#FFC400',
                        },
                    },
                },
                {
                    name: 'disposal',
                    type: 'effectScatter',
                    coordinateSystem: 'GLMap',
                    zlevel: 2,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                    },
                    label: {
                        normal: {
                            show: false,
                            position: 'right',
                            formatter: '{b}',
                            color: '#303133',
                        },
                        emphasis: {
                            show: true,
                        },
                    },
                    symbolSize: 20,
                    itemStyle: {
                        normal: {
                            color: '#00E696',
                        },
                    },
                    data: routeData.map(function(dataItem: any) {
                        return {
                            name: dataItem.toName,
                            value: dataItem.coords[1],
                        };
                    }),
                },
            ],
        };

        layers.cesiumEchartsLayer = new CesiumEchartsLayer((window as any).cesiumMap, option);

    }
    /**
     * 删除 cesium 固废图层 echarts 渲染
     */
    public async deleteCesiumEchartsSolidLayer() {
        console.log('删除迁徙图');
        if (layers.cesiumEchartsLayer) {
            layers.cesiumEchartsLayer.destroy();
        }
        layers.cesiumEchartsLayer = null;
    }
    /************************************  Cesium  ***********************************************************/

    /************************************  MapBox  ***********************************************************/
    /**
     * 渲染 mapbox 固废图层 echarts 渲染
     */
    public async renderMapboxEchartsSolidLayer() {
        console.log('渲染固废图层');
        const res = responseData.default;
        if (!layers.mapboxEchartsLayer) {
            const EchartsLayer = require('../../map/service/mapbox/pugin/echartslayer-libs/index.js');
            layers.mapboxEchartsLayer = new EchartsLayer((window as any).mapboxMap);
            layers.mapboxEchartsLayer.chart.on('click', (e: any) => {
                console.log(e);
            });
        }
        let routes: any = {};
        res.forEach((d: any, idx: any) => {
            if (this.checkTransferCoordinate(d.produce.coordinates) && this.checkTransferCoordinate(d.disposal.coordinates)) {
                let key = d.produce.name + '-' + d.disposal.name;
                if (!routes[key]) {
                    routes[key] = {
                        code: d.code,
                        fromName: d.produce.name,
                        toName: d.disposal.name,
                        coords: [d.produce.coordinates, d.disposal.coordinates],
                        codes: [d.code],
                    };
                } else {
                    routes[key].codes.push(d.code);
                }
            } else {
                res.splice(idx, 1);
            }
        });
        let routeData = Object.values(routes);
        let option = {
            GLMap: {
                roam: true,
            },
            animation: false, //取消动画效果
            coordinateSystem: 'GLMap',
            geo: {
                map: 'GLMap',
                label: {
                    emphasis: {
                        show: false,
                    },
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#404a59',
                    },
                    emphasis: {
                        areaColor: '#2a333d',
                    },
                },
            },
            series: [
                {
                    coordinateSystem: 'GLMap',
                    type: 'lines',
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: '#a6c84c',
                        symbolSize: 5,
                        constantSpeed: 25,
                    },
                    lineStyle: {
                        normal: {
                            color: '#a6c84c',
                            width: 0,
                            curveness: 0.2,
                        },
                    },
                    data: routeData,
                },
                {
                    coordinateSystem: 'GLMap',
                    type: 'lines',
                    zlevel: 2,
                    lineStyle: {
                        normal: {
                            color: '#30D385',
                            width: 1,
                            curveness: 0.2,
                        },
                    },
                    data: routeData,
                    blendMode: 'lighter',
                },
                {
                    name: 'produce',
                    type: 'scatter',
                    coordinateSystem: 'GLMap',
                    zlevel: 2,
                    showEffectOn: 'render',
                    data: routeData.map(function(dataItem: any) {
                        return {
                            name: dataItem.fromName,
                            value: dataItem.coords[0],
                        };
                    }),
                    symbolSize: 10,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false,
                        },
                        emphasis: {
                            show: true,
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: '#FFC400',
                        },
                    },
                },
                {
                    name: 'disposal',
                    type: 'effectScatter',
                    coordinateSystem: 'GLMap',
                    zlevel: 2,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                    },
                    label: {
                        normal: {
                            show: false,
                            position: 'right',
                            formatter: '{b}',
                            color: '#303133',
                        },
                        emphasis: {
                            show: true,
                        },
                    },
                    symbolSize: 20,
                    itemStyle: {
                        normal: {
                            color: '#00E696',
                        },
                    },
                    data: routeData.map(function(dataItem: any) {
                        return {
                            name: dataItem.toName,
                            value: dataItem.coords[1],
                        };
                    }),
                },
            ],
        };

        layers.mapboxEchartsLayer.chart.setOption(option);
    }
    /**
     * 删除 mapbox 固废图层 echarts 渲染
     */
    public async deleteMapboxEchartsSolidLayer() {
        if (layers.mapboxEchartsLayer) {
            layers.mapboxEchartsLayer.remove();
        }
        layers.mapboxEchartsLayer = null;

    }

    /************************************  MapBox  ***********************************************************/

    /************************************  Leaflet  ***********************************************************/
    /**
     * 渲染 leaflet 固废图层 echarts 渲染
     */
    public async renderLeafletEchartsSolidLayer() {
        const res = responseData.default;
        let routes: any = {};
        res.forEach((d: any, idx: any) => {
            let key = d.produce.name + '-' + d.disposal.name;
            if (!routes[key]) {
                routes[key] = {
                    code: d.code,
                    fromName: d.produce.name,
                    toName: d.disposal.name,
                    coords: [d.produce.coordinates, d.disposal.coordinates],
                    codes: [d.code],
                };
            } else {
                routes[key].codes.push(d.code);
            }
        });
        let routeData = Object.values(routes);
        console.log(routeData);
        const series1 = [
            {
                coordinateSystem: 'leaflet',
                type: 'lines',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#a6c84c',
                    symbolSize: 5,
                    constantSpeed: 25,
                },
                lineStyle: {
                    normal: {
                        color: '#a6c84c',
                        width: 0,
                        curveness: 0.2,
                    },
                },
                data: routeData,
            },
            {
                coordinateSystem: 'leaflet',
                type: 'lines',
                zlevel: 2,
                lineStyle: {
                    normal: {
                        color: '#30D385',
                        width: 1,
                        curveness: 0.2,
                    },
                },
                data: routeData,
                blendMode: 'lighter',
            },
            {
                name: 'produce',
                type: 'scatter',
                coordinateSystem: 'leaflet',
                zlevel: 2,
                showEffectOn: 'render',
                data: routeData.map(function(dataItem: any) {
                    return {
                        name: dataItem.fromName,
                        value: dataItem.coords[0],
                    };
                }),
                symbolSize: 10,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false,
                    },
                    emphasis: {
                        show: true,
                    },
                },
                itemStyle: {
                    normal: {
                        color: '#FFC400',
                    },
                },
            },
            {
                name: 'disposal',
                type: 'effectScatter',
                coordinateSystem: 'leaflet',
                zlevel: 2,
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke',
                },
                label: {
                    normal: {
                        show: false,
                        position: 'right',
                        formatter: '{b}',
                        color: '#303133',
                    },
                    emphasis: {
                        show: true,
                    },
                },
                symbolSize: 20,
                itemStyle: {
                    normal: {
                        color: '#00E696',
                    },
                },
                data: routeData.map(function(dataItem: any) {
                    return {
                        name: dataItem.toName,
                        value: dataItem.coords[1],
                    };
                }),
            },
        ];
        const option = {
            tooltip: {
                trigger: 'item'
            },
            series: series1
        };
        if (layers.leafletEchartsLayer) {
            layers.leafletEchartsLayer.remove();
        }
        layers.leafletEchartsLayer = (L as any).supermap.echartsLayer(option).addTo((window as any).leafletMap);

    }
    /**
     * 删除 leaflet 固废图层 echarts 渲染
     */
    public async deleteLeafletEchartsSolidLayer() {
        if (layers.leafletEchartsLayer) {
            layers.leafletEchartsLayer.remove();
        }
        layers.leafletEchartsLayer = null;

    }
    /************************************  Leaflet  ***********************************************************/

    public beforeDestroy() {
        try {
            this.deleteCesiumEchartsSolidLayer();
            this.deleteLeafletEchartsSolidLayer();
            this.deleteMapboxEchartsSolidLayer()
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
