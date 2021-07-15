export const data = {
    /*{
        path: '/dataManage/interpolation',
            name: '插值',
        component: () => import('../views/dataManage/Interpolation.vue'),
    },
    {
        path: '/dataManage/migrationMapPage',
            name: '迁徙图',
        component: () => import('../views/dataManage/MigrationMapPage.vue'),
    },
    {
        path: '/dataManage/windFieldPage',
            name: '风场',
        component: () => import('../views/dataManage/WindFieldPage.vue'),
    }*/
    list: [
        {
            entity: {
                id: 6,
                parentMenuId: 0,
                name: "baseManage",
                icon: "el-icon-news",
                alias: "基本要素",
                state: "ENABLE",
                sort: 1,
                value: null,
                type: "NONE",
                discription: "用于用户管理的菜单",
                createUserId: 1,
            },
            childs: [
                {
                    entity: {
                        id: 7,
                        parentMenuId: 6,
                        name: '/baseManage/marker',
                        icon: 'el-icon-user\r\n',
                        alias: '点',
                        state: 'ENABLE',
                        sort: 0,
                        value: '/baseManage/marker',
                        type: 'NONE',
                        discription: '基本图层点信息',
                        createUserId: 1,
                    },
                },
                {
                    entity: {
                        id: 7,
                        parentMenuId: 6,
                        name: '/baseManage/line',
                        icon: 'el-icon-user\r\n',
                        alias: '线',
                        state: 'ENABLE',
                        sort: 0,
                        value: '/baseManage/line',
                        type: 'NONE',
                        discription: '基本图层点信息',
                        createUserId: 1,
                    },
                },
                {
                    entity: {
                        id: 9,
                        parentMenuId: 6,
                        name: '/baseManage/cover',
                        icon: 'el-icon-user\r\n',
                        alias: '面',
                        state: 'ENABLE',
                        sort: 0,
                        value: '/baseManage/cover',
                        type: 'NONE',
                        discription: '基本图层点信息',
                        createUserId: 1,
                    },
                },
                {
                    entity: {
                        id: 7,
                        parentMenuId: 6,
                        name: '/baseManage/popUp',
                        icon: 'el-icon-user\r\n',
                        alias: '弹框',
                        state: 'ENABLE',
                        sort: 0,
                        value: '/baseManage/popUp',
                        type: 'NONE',
                        discription: '基本图层点信息',
                        createUserId: 1,
                    },
                },
            ],
        },
        {
            entity: {
                id: 16,
                parentMenuId: 0,
                name: "dataManage",
                icon: "el-icon-news",
                alias: "数据应用",
                state: "ENABLE",
                sort: 1,
                value: null,
                type: "NONE",
                discription: "用于用户管理的菜单",
                createUserId: 1,
            },
            childs: [
                {
                    entity: {
                        id: 17,
                        parentMenuId: 16,
                        name: '/dataManage/interpolation',
                        icon: 'el-icon-user\r\n',
                        alias: '插值',
                        state: 'ENABLE',
                        sort: 0,
                        value: '/dataManage/interpolation',
                        type: 'NONE',
                        discription: '插值',
                        createUserId: 1,
                    },
                },
                {
                    entity: {
                        id: 18,
                        parentMenuId: 16,
                        name: '/dataManage/migrationMapPage',
                        icon: 'el-icon-user\r\n',
                        alias: '迁徙图',
                        state: 'ENABLE',
                        sort: 0,
                        value: '/dataManage/migrationMapPage',
                        type: 'NONE',
                        discription: '迁徙图',
                        createUserId: 1,
                    },
                },
                {
                    entity: {
                        id: 19,
                        parentMenuId: 16,
                        name: '/dataManage/windFieldPage',
                        icon: 'el-icon-user\r\n',
                        alias: '风场',
                        state: 'ENABLE',
                        sort: 0,
                        value: '/dataManage/windFieldPage',
                        type: 'NONE',
                        discription: '风场',
                        createUserId: 1,
                    },
                }
            ],
        },
        {
            entity: {
                id: 26,
                parentMenuId: 0,
                name: "modelManage",
                icon: "el-icon-news",
                alias: "模型应用",
                state: "ENABLE",
                sort: 1,
                value: null,
                type: "NONE",
                discription: "模型",
                createUserId: 1,
            },
            childs: [
                {
                    entity: {
                        id: 27,
                        parentMenuId: 26,
                        name: '/modelManage/cesiumBaseModel',
                        icon: 'el-icon-user\r\n',
                        alias: 'cesium基本模型',
                        state: 'ENABLE',
                        sort: 0,
                        value: '/modelManage/cesiumBaseModel',
                        type: 'NONE',
                        discription: 'cesium基本模型',
                        createUserId: 1,
                    },
                },
                {
                    entity: {
                        id: 28,
                        parentMenuId: 26,
                        name: '/modelManage/mapBoxBaseModel',
                        icon: 'el-icon-user\r\n',
                        alias: 'mapbox基本模型',
                        state: 'ENABLE',
                        sort: 0,
                        value: '/modelManage/mapBoxBaseModel',
                        type: 'NONE',
                        discription: 'mapbox基本模型',
                        createUserId: 1,
                    },
                },
                {
                    entity: {
                        id: 30,
                        parentMenuId: 26,
                        name: '/modelManage/cesiumCityModel',
                        icon: 'el-icon-user\r\n',
                        alias: 'cesium城市模型',
                        state: 'ENABLE',
                        sort: 0,
                        value: '/modelManage/cesiumCityModel',
                        type: 'NONE',
                        discription: 'cesium城市模型',
                        createUserId: 1,
                    },
                },
                {
                    entity: {
                        id: 29,
                        parentMenuId: 26,
                        name: '/modelManage/mapBoxCityModel',
                        icon: 'el-icon-user\r\n',
                        alias: 'mapbox城市模型',
                        state: 'ENABLE',
                        sort: 0,
                        value: '/modelManage/MapBoxCityModel',
                        type: 'NONE',
                        discription: 'mapbox城市模型',
                        createUserId: 1,
                    },
                }
            ],
        },
        {
            entity: {
                id: 26,
                parentMenuId: 0,
                name: "echartManage",
                icon: "el-icon-news",
                alias: "数据融合",
                state: "ENABLE",
                sort: 1,
                value: null,
                type: "NONE",
                discription: "模型",
                createUserId: 1,
            },
            childs: [
            ],
        }
    ],
};
