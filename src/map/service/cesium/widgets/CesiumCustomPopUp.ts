/**
 * @author fei_yong
 * @since 2021-07-11 9:39
 * @desc cesium 自定义弹框
 */
import { Cartesian2, Event, SceneTransforms, Viewer } from 'cesium';

interface CesiumCustomPopUpOption {
    viewer: Viewer;    // 地图实例
    $sel: HTMLElement;
    position: any;
    windowCloseCallback?: () => void;
}
export class CesiumCustomPopUp {

    private viewer: Viewer;

    private $sel: HTMLElement;

    private position: any;

    private windowCloseCallback: () => void;

    private removeListener: Event.RemoveCallback;

    constructor(options: CesiumCustomPopUpOption) {
        this.init(options);
    }

    /**
     * 組件初始化
     * @param options
     * @private
     */
    private init(options: CesiumCustomPopUpOption) {
        this.viewer = options.viewer;
        this.$sel = options.$sel;
        this.position = options.position;
        if (options.windowCloseCallback && typeof options.windowCloseCallback === 'function') {
            this.windowCloseCallback = options.windowCloseCallback;
        }
        this.viewer.cesiumWidget.container.appendChild(this.$sel); //将字符串模板生成的内容添加到DOM上
        this.addPostRender();

    }

    /**
     * 關閉彈框
     */
    public destroy() {
        try {
            if (this.windowCloseCallback && typeof this.windowCloseCallback === 'function') {
                this.windowCloseCallback();
            }
            // 移除弹框内容
            this.viewer.cesiumWidget.container.removeChild(this.$sel);
            if (this.removeListener) {
                this.removeListener();
            }
            // 移除事件监听
            // this.viewer.scene.postRender.removeEventListener(this.postRender, this);
        }catch (e) {
            console.log(e);
        }

    }

    /**
     * 事件绑定
     */
    public addPostRender() {
        this.removeListener = this.viewer.scene.postRender.addEventListener(this.postRender, this);
    }

    /**
     * 定位、样式处理
     */
    public postRender() {
        if (!this.$sel || !this.$sel.style) return;
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cartesian2();
        SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.position, windowPosition);
        this.$sel.style.bottom = canvasHeight - windowPosition.y + 40 + "px";
        const elWidth: number = this.$sel.offsetWidth;
        this.$sel.style.left = windowPosition.x - (elWidth / 2) + "px";

        // TODO 此处逻辑有问题，暂时屏蔽掉

        // if (this.viewer.camera.positionCartographic.height > 4000) {
        //     this.$sel.style.display = "none";
        // } else {
        //     this.$sel.style.display = "block";
        // }
    }


}
