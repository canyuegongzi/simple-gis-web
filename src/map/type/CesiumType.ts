export interface CesiumInstanceOptions {
    id: string;
    animation?: boolean; //是否创建动画小器件，左下角仪表
    baseLayerPicker?: boolean; //是否显示图层选择器
    fullscreenButton?: boolean; //是否显示全屏按钮
    vrButton?: boolean;   // 是否显示VR按钮
    geocoder?: boolean; // 是否显示geocoder小器件，右上角查询按钮
    homeButton?: boolean;  //是否显示Home按钮
    infoBox?: boolean; //是否显示信息框
    sceneModePicker?: boolean; // 是否显示3D/2D选择器
    selectionIndicator?: boolean; // 是否显示选取指示器组件
    timeline?: boolean; // 是否显示时间轴
    navigationHelpButton?: boolean; // 是否显示右上角的帮助按钮
    scene3DOnly?: boolean // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    navigationInstructionsInitiallyVisible?: boolean;
    showRenderLoopErrors?: boolean;
    //加载自定义地图瓦片需要指定一个自定义图片服务器 例如指定OpenStreetMapImagerProvider
    //URL 为瓦片数据服务器地址
    imageryProvider?: any;  //UrlTemplateImageryProvider
    templateImageLayerUrl?: string;
    enableLighting?: boolean; // 是否启用照明
}
