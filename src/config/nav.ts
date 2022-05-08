export const list = [
    {
        name: '基本要素',
        path: 'baseManage',
        redirect: {
            name: '点要素'
        },
        meta: {
            icon:"el-icon-picture-outline-round",
            name:"基本要素"
        },
        children: [
            {
                name: 'Marker',
                path: '/baseManage/PointView',
                meta: {
                    icon:"el-icon-picture-outline-round",
                    name:"Marker"
                },
            },
            {
                name: 'Polyline',
                path: '/baseManage/LineView',
                meta: {
                    icon:"el-icon-picture-outline-round",
                    name:"Polyline"
                },
            },
            {
                name: 'Polygon',
                path: '/baseManage/PolygonView',
                meta: {
                    icon:"el-icon-picture-outline-round",
                    name:"PolygonView"
                },
            },
            {
                name: 'Popup',
                path: '/baseManage/PopupView',
                meta: {
                    icon:"el-icon-picture-outline-round",
                    name:"Popup"
                },
            },



        ]
    },
    {
        name: '基本操作',
        path: 'handlerManage',
        redirect: {
            name: '基本操作'
        },
        meta: {
            icon:"el-icon-picture-outline-round",
            name:"基本操作"
        },
        children: [
            {
                name: '基本操作',
                path: '/handlerManage/HandlerMarkerView',
                meta: {
                    icon:"el-icon-picture-outline-round",
                    name:"HandlerMarkerView"
                },
            },
            {
                name: '空间测量',
                path: '/handlerManage/SpaceSurveyingView',
                meta: {
                    icon:"el-icon-picture-outline-round",
                    name:"SpaceSurveyingView"
                },
            },
        ]
    },
    {
        name: '数据分析',
        path: 'dataManage',
        /*redirect: {
            name: '地图测量'
        },*/
        meta: {
            icon:"el-icon-picture-outline-round",
            name:"基本操作"
        },
        children: [

        ]
    }
]
