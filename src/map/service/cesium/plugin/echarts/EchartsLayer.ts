// @ts-nocheck
import echarts from "echarts";
import RegisterCoordinateSystem from "./RegisterCoordinateSystem";

export class EchartsLayer {
    private _chartLayer: echarts.ECharts;
    private readonly _viewer: any;
    private option: any;
    private _isRegistered: boolean;
    private _echartsContainer: any;
    constructor(viewer: any, option: any) {
        this._viewer = viewer;
        this._isRegistered = false;
        this._chartLayer = this._createLayerContainer();
        this.option = option;
        this._chartLayer.setOption(option);
    }

    _createLayerContainer() {
        const scene: any = this._viewer.scene;
        const container: any = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '0px';
        container.style.left = '0px';
        container.style.right = '0px';
        container.style.bottom = '0px';
        container.style.width = scene.canvas.width + "px";
        container.style.height = scene.canvas.height + "px";
        container.style.pointerEvents = "none";
        this._viewer.container.appendChild(container);
        this._echartsContainer = container;
        (echarts as any).glMap = scene;
        this._register();
        return (echarts as any).init(container);
    }
    _register() {
        if (this._isRegistered) return;
        (echarts as any).registerCoordinateSystem("GLMap", new RegisterCoordinateSystem((echarts as any).glMap));
        (echarts as any).registerAction({
            type: "GLMapRoam",
            event: "GLMapRoam",
            update: "updateLayout"
        }, function(e: any, t: any) {});
        (echarts as any).extendComponentModel({
            type: "GLMap",
            getBMap: function() {
                return this.__GLMap;
            },
            defaultOption: {
                roam: !1
            }
        });
        (echarts as any).extendComponentView({
            type: "GLMap",
            init: function(echartModel: any, api: any) {
                this.api = api, (echarts as any).glMap.postRender.addEventListener(this.moveHandler, this);
            },
            moveHandler: function(e: any, t: any) {
                this.api.dispatchAction({
                    type: "GLMapRoam"
                });
            },
            render: function(e: any, t, i: any) {},
            dispose: function() {
                (echarts as any).glMap.postRender.removeEventListener(this.moveHandler, this);
            }
        });
        this._isRegistered = true;
    }

    dispose() {
        this._echartsContainer && (this._viewer.container.removeChild(this._echartsContainer), this._echartsContainer = null);
        this._chartLayer && (this._chartLayer.dispose(), this._chartLayer = null);
        this._isRegistered = false;
    }

    destroy() {
        this.dispose();
    }

    updateEchartsLayer(option: any) {
        this._chartLayer && this._chartLayer.setOption(option);
    }

    getMap() {
        return this._viewer;
    }

    getEchartsLayer() {
        return this._chartLayer;
    }

    show() {
        this._echartsContainer && (this._echartsContainer.style.visibility = "visible");
    }

    hide() {
        this._echartsContainer && (this._echartsContainer.style.visibility = "hidden");
    }

}

export default EchartsLayer;
// @ts-check
