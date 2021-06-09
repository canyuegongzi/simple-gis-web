import MapService from '../common/MapService';
import { CesiumInstanceOptions } from '@/map/type/CesiumType';
import { BaseMap, LayerImagesEnum, MapTypeEnum, ChangeLayerImageConfig } from '@/map/type/CommonType';
import CommonStore from '../../map/common/CommonStore';
import { Viewer, UrlTemplateImageryProvider } from 'cesium';
import '../service/cesium/imageryProvider/index';
import { AmapImageryProvider, BaiduImageryProvider } from '../service/cesium/imageryProvider/index';
export default class CesiumService extends MapService implements BaseMap{
    constructor(props: CesiumInstanceOptions) {
        super();
    }

    /**
     * 初始化地图实例
     * @param type
     * @param props
     * @protected
     */
    public async initMapInstance(type: MapTypeEnum, props: CesiumInstanceOptions): Promise<any> {
        const mapInstanceCache: any = await CommonStore.getInstance('CESIUM');
        if (mapInstanceCache) {
            return mapInstanceCache;
        }
        const map: Viewer = new Viewer(props.id, {
            ...CesiumService.mergeOptions(props),
        });
        CommonStore.setInstance(type, map);
        // 启用地球照明
        map.scene.globe.enableLighting = !!props.enableLighting;
        // 影藏掉底部的logo
        const logo: HTMLElement = document.querySelector('.cesium-viewer-bottom') as HTMLElement;
        if (logo) {
            logo.style.display = 'none';
        }
        return map;
    }

    /**
     * 修改图层
     * @param type
     * @param config
     * @param instance
     */
    public changeLayer<T>(type: LayerImagesEnum, config: ChangeLayerImageConfig, instance: T): T {
        switch (type) {
        case 'AMAP':
            // @ts-ignore
            instance.imageryLayers.addImageryProvider(new AmapImageryProvider(config));
            break;
        case 'BAIDU':
            // @ts-ignore
            instance.imageryLayers.addImageryProvider(new BaiduImageryProvider(config));
            break;
        }
        return instance;

    }

    /**
     * 合并参数
     * @param props
     * @private
     */
    private static mergeOptions(config: CesiumInstanceOptions, ): CesiumInstanceOptions {
        const defaultParams: CesiumInstanceOptions = {
            id: config.id,
            animation: config.animation || false,
            baseLayerPicker: config.baseLayerPicker || false,
            fullscreenButton: config.fullscreenButton || false,
            vrButton: config.vrButton || false,
            geocoder: config.geocoder || false,
            homeButton: config.homeButton || false,
            infoBox: config.infoBox || false,
            sceneModePicker: config.sceneModePicker || false,
            selectionIndicator: config.selectionIndicator || false,
            timeline: config.timeline || false,
            navigationHelpButton: config.navigationHelpButton || false,
            scene3DOnly: true,
            navigationInstructionsInitiallyVisible: false,
            showRenderLoopErrors: false,
            imageryProvider: (config.templateImageLayerUrl
                ? new UrlTemplateImageryProvider({
                    url: config.templateImageLayerUrl,
                })
                : null) as UrlTemplateImageryProvider,
        };
        return defaultParams;
    }
}
