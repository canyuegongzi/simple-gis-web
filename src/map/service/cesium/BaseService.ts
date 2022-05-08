/**
 * cesium 地图基本方法
 */
import {BaseCesiumServiceInterface} from "../interface";
import {
    Viewer,
    Cartesian3,
    Entity,
    Camera,
    Rectangle,
    Matrix4,
    EasingFunction,
    Math as CesiumMath,
    Cartographic, Cartesian2
} from "cesium";

export class BaseService implements BaseCesiumServiceInterface {
    public map!: Viewer;

    public defaultCameraPosition!: Cartesian3;

    public defaultCameraPositionZ!: number;

    public init(element: string | HTMLElement, options: Viewer.ConstructorOptions, callback?: (viewer: Viewer) => void): Viewer {
        const map = new Viewer(element, this.getOptions(options));
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
        callback?.(map);
        this.defaultCameraPosition = map.camera.position;
        this.defaultCameraPositionZ = map.camera.position.z;
        options.homeButton && map.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
            e.cancel = true;
            this.resetMap();
        });
        this.map = map;
        return this.map;
    }

    public resetMap(): Viewer {
        this.map?.camera.flyTo({
            destination: Cartesian3.fromDegrees(117.16, 32.71, this.defaultCameraPositionZ)
        });
        return this.map;
    }

    public getPosition(longitude: number, latitude: number, height?: number) {
        return Cartesian3.fromDegrees(longitude, latitude, height)
    }

    protected getOptions(options: Viewer.ConstructorOptions): Viewer.ConstructorOptions {
        return {
            animation: options.animation || false,  // 是否创建动画小器件，左下角仪表
            baseLayerPicker: options.baseLayerPicker || false,  //是否显示图层选择器
            fullscreenButton: options.fullscreenButton || false, // 是否显示全屏按钮
            vrButton: options.vrButton || false,         //是否显示VR按钮
            geocoder: options.geocoder || false, //是否显示geocoder小器件，右上角查询按钮
            homeButton: options.homeButton || false, //是否显示Home按钮
            infoBox: options.infoBox || false, //是否显示信息框
            sceneModePicker: options.sceneModePicker || false, // 是否显示3D/2D选择器
            selectionIndicator: options.selectionIndicator || false, // 是否显示选取指示器组件
            timeline: options.timeline || false, // 是否显示时间轴
            navigationHelpButton: options.navigationHelpButton || false,  // 是否显示右上角的帮助按钮
            scene3DOnly: true, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            navigationInstructionsInitiallyVisible: false,
            showRenderLoopErrors: false,
            imageryProvider: options.imageryProvider,
            requestRenderMode: typeof options.requestRenderMode === 'boolean'? options.requestRenderMode: true,
            ...options
        }
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
     * @param options
     */
    public flyTo(options: { destination: Cartesian3 | Rectangle; orientation?: any; duration?: number; complete?: Camera.FlightCompleteCallback; cancel?: Camera.FlightCancelledCallback; endTransform?: Matrix4; maximumHeight?: number; pitchAdjustHeight?: number; flyOverLongitude?: number; flyOverLongitudeWeight?: number; convert?: boolean; easingFunction?: EasingFunction.Callback; }) {
        return this.map.camera.flyTo(options);
    }

    /**
     * 中心视图设置
     * @param camera
     * @param options
     */
    public setView(camera: Camera, options: { destination?: Cartesian3 | Rectangle; orientation?: any; endTransform?: Matrix4; convert?: boolean; }) {
        return camera.setView(options);
    }

    /**
     * 获取经纬度 椭球上的点
     * @param event
     */
    public getCoordinate(event: { position: Cartesian2 }) {
        // pickEllipsoid 获取椭球上的点的经纬度（椭球上的点）
        let cartesian: Cartesian3 = this.map.camera.pickEllipsoid(event.position) as Cartesian3;
        // getPickRay 获取地表面的点的经纬度（地形上的点
        // pickPosition 获取场景里的点的经纬度（模型上的点）
        let cartographic = Cartographic.fromCartesian(cartesian);
        let lng = CesiumMath.toDegrees(cartographic.longitude); // 经度
        let lat = CesiumMath.toDegrees(cartographic.latitude); // 纬度
        let alt = cartographic.height; // 高度，椭球面height永远等于0
        let coordinate = {
            longitude: Number(lng.toFixed(6)),
            latitude: Number(lat.toFixed(6)),
            altitude: Number(alt.toFixed(2))
        };
        return coordinate;
        console.log(coordinate);
    }
}
