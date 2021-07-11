/**
 * @author fei_yong
 * @since 2021-07-010 9:39
 * @desc cesium 聚合点位类
 */

import { GeoJsonDataSource, Resource, Viewer, Event, VerticalOrigin, Entity, Color, HorizontalOrigin, EntityCluster, DataSource } from 'cesium';

interface ClusterWidgetsOption {
    viewer: Viewer;    // 地图实例
    data: Resource;    // geoJson 格式的点位数据
    clustering?: EntityCluster;   // 点位聚合形态
    rebuildCluster?: (clusteredEntities: any[], cluster: any) => void   // 动态重建聚合点样式
    selectedEntity?: (e: any) => void   // 点击事件回调
}

export class CesiumClusterWidgets {

    private viewer: Viewer;

    private readonly data: Resource;

    private removeListener: Event.RemoveCallback;

    private cluserLayerResource: DataSource | null;

    private geoJsonDataSource: any;   // cesium 加载后的geo

    constructor(options: ClusterWidgetsOption) {
        this.viewer = options.viewer;
        this.data = options.data;
        if (options.rebuildCluster && typeof options.rebuildCluster === 'function') {
            this.rebuildCluster = options.rebuildCluster;
        }
        if (options.selectedEntity && typeof options.selectedEntity === 'function') {
            console.log(22222);
            this.selectedEntityChanged = options.selectedEntity;
        }
        this.initCluser(options).then(r => {
        });
        this.viewer.selectedEntityChanged.addEventListener(this.selectedEntityChanged);
    }

    /**
     * 初始化聚合
     * @private
     */
    private async initCluser(options: ClusterWidgetsOption) {
        const geoJsonDataSource: GeoJsonDataSource = await GeoJsonDataSource.load(this.data);
        this.cluserLayerResource = await this.viewer.dataSources.add(geoJsonDataSource);

        // 设置聚合的形态
        geoJsonDataSource.clustering.enabled = typeof options.clustering?.enabled === 'boolean' ? options.clustering?.enabled : true;
        geoJsonDataSource.clustering.clusterLabels = typeof options.clustering?.clusterLabels === 'boolean' ? options.clustering?.clusterLabels : false;
        geoJsonDataSource.clustering.pixelRange = options.clustering?.pixelRange || 15;
        geoJsonDataSource.clustering.minimumClusterSize = options.clustering?.minimumClusterSize || 3;

        this.setClusterEvent(geoJsonDataSource);

        geoJsonDataSource.entities.values.forEach((entity: Entity) => {
            // @ts-ignore
            entity.billboard.image = require('../../../../assets/map/site.png');
            // entity.cameraCode = entity._properties.CAMERACODE._value;//设置entity的属性
            // @ts-ignore
            entity.type = 'cluser';
            //如果有高度信息 需要重新赋值
            // let cartographic = Cesium.Cartographic.fromCartesian(entity.position._value);基本要素
            // let longitude = Cesium.Math.toDegrees(cartographic.longitude);
            // let latitude = Cesium.Math.toDegrees(cartographic.latitude);
            // entity.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, Number(entity._properties.Z._value));
        });
        this.geoJsonDataSource = geoJsonDataSource;
    }

    /**
     * 点击事件监听
     * @param geoJsonDataSource
     * @private
     */
    private setClusterEvent(geoJsonDataSource: GeoJsonDataSource) {
        this.removeListener = geoJsonDataSource.clustering.clusterEvent.addEventListener(
            (clusteredEntities: any[], cluster: any) => {
                this.rebuildCluster(clusteredEntities, cluster);
            },
        );
    }

    /**
     * 实体点击
     * @param e
     * @private
     */
    private selectedEntityChanged(e: any) {
        console.log(e);
        // console.log(e)能够拿到选中的实体 如果是聚合对象 e.id为一个entity数组 个数为聚合个数
    }

    /**
     * 聚合销毁
     * @private
     */
    public destroy() {
        // 销毁掉事件监听
        this.removeListener();
        this.viewer.dataSources.remove(this.cluserLayerResource as DataSource);
        this.cluserLayerResource = null;
    }

    /**
     * 聚合点样式重写
     * @param clusteredEntities
     * @param cluster
     * @private
     */
    private rebuildCluster(clusteredEntities: any[], cluster: any) {
        cluster.billboard.show = true;
        cluster.label.show = true;
        cluster.label.text = clusteredEntities.length + '';
        cluster.label.scale = 0.5;
        cluster.label.fillColor = Color.RED;
        cluster.label.color = Color.RED;
        // cluster.label.pointOutlineColor = Color.T;
        cluster.label.pointOutlineWidth = 0;
        cluster.label.verticalOrigin = VerticalOrigin.CENTER;
        cluster.label.horizontalOrigin = HorizontalOrigin.CENTER;
        cluster.label.showBackground = true;
        cluster.label.backgroundColor = Color.TRANSPARENT;
        // cluster.label.labelOutlineColor = Color.TRANSPARENT;
        cluster.label.labelOutlineWidth = 0;

        cluster.billboard.id = cluster.label.id;
        cluster.billboard.verticalOrigin = VerticalOrigin.CENTER;
        cluster.billboard.image = require('../../../../assets/map/site-5.png');
        cluster.billboard.width = 28;
        cluster.billboard.height = 28;
    }
}

