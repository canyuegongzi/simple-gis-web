import MapService from '../common/MapService';
import { CesiumInstanceOptions } from '@/map/type/CesiumType';
import { BaseMap, LayerImagesEnum, MapTypeEnum, ChangeLayerImageConfig } from '@/map/type/CommonType';
import CommonStore from '../../map/common/CommonStore';
import { Viewer, UrlTemplateImageryProvider, Entity, Cartesian3, Rectangle, Camera, Ion, Matrix4, EasingFunction, } from 'cesium';
import '../service/cesium/imageryProvider/index';
import { AmapImageryProvider, BaiduImageryProvider, TdtImageryProvider } from '../service/cesium/imageryProvider/index';


export default class CesiumService extends MapService implements BaseMap{
    constructor(props: CesiumInstanceOptions) {
        Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZTc3YzJkZS03Y2MwLTQxOTMtOGE1OC0yZWI5NjU2MWI4YTEiLCJpZCI6NTgzMTIsImlhdCI6MTYzMTQ0MjY0M30.efQBG7QmD_JweNb9bt8P6-XqJTskjXicS0eiEAbIe2I';
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
        console.log(mapInstanceCache);
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
        map.scene.morphTo3D(0.0); //默认三维地图

        //关闭快速抗锯齿,文字清晰
        map.scene.postProcessStages.fxaa.enabled = false;
        map.scene.highDynamicRange = false;

        //禁止相机入地
        map.scene.screenSpaceCameraController.minimumZoomDistance = 2500;   //原来是100
        (map.scene.screenSpaceCameraController as any)._minimumZoomRate = 30000;   //设置相机缩小时的速率
        map.clock.onTick.addEventListener(() => {
            if (map.camera.pitch > 0) {
                map.scene.screenSpaceCameraController.enableTilt = false;
            }
        });
        return map;
    }

    /**
     * 修改图层
     * @param type
     * @param config
     * @param instance
     */
    public changeLayer<T extends Viewer>(type: LayerImagesEnum, config: ChangeLayerImageConfig, instance: T): T {
        switch (type) {
        case 'AMAP':
            instance.imageryLayers.addImageryProvider(new AmapImageryProvider(config));
            break;
        case 'BAIDU':
            // @ts-ignore
            instance.imageryLayers.addImageryProvider(new BaiduImageryProvider(config));
            break;
        case 'TIANDITU':
            instance.imageryLayers.addImageryProvider(new TdtImageryProvider(config));
            break;
        }
        return instance;

    }

    /**
     * 渲染html marker
     * @param html
     * @param instance
     */
    public renderHtmlMarker<T>(html: string, instance: T): any {
        return null;
    }

    /**
     * 合并参数
     * @param props
     * @private
     */
    private static mergeOptions(config: CesiumInstanceOptions): CesiumInstanceOptions {
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


    /**
     * 创建marker
     * @param options
     */
    public createMarker(options: Entity.ConstructorOptions) {
        return new Entity(options);
    }

    /**
     * 相机飞行
     * @param camera
     * @param options
     */
    public flyTo(camera: Camera, options: { destination: Cartesian3 | Rectangle; orientation?: any; duration?: number; complete?: Camera.FlightCompleteCallback; cancel?: Camera.FlightCancelledCallback; endTransform?: Matrix4; maximumHeight?: number; pitchAdjustHeight?: number; flyOverLongitude?: number; flyOverLongitudeWeight?: number; convert?: boolean; easingFunction?: EasingFunction.Callback; }) {
        return camera.flyTo(options);
    }

    /**
     * 中心视图设置
     * @param camera
     * @param options
     */
    public setView(camera: Camera, options: { destination?: Cartesian3 | Rectangle; orientation?: any; endTransform?: Matrix4; convert?: boolean; }) {
        return camera.setView(options);
    }
}
