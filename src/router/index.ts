import Vue from 'vue';
import VueRouter, { RawLocation } from 'vue-router';

Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location: RawLocation) {
    // @ts-ignore
    return originalPush.call(this, location).catch((err: any) => err);
};
export const router: VueRouter = new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: {
                path: '/baseManage/marker'
            }
        },
        {
            path: '/baseManage/marker',
            component: () => import('../views/baseManage/MarkerPage.vue'),
        },
        {
            path: '/baseManage/line',
            component: () => import('../views/baseManage/LinePage.vue'),
        },
        {
            path: '/baseManage/popUp',
            component: () => import('../views/baseManage/PopUpPage.vue'),
        },
        {
            path: '/baseManage/cover',
            component: () => import('../views/baseManage/CoverPage.vue'),
        },
        {
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
        },
        {
            path: '/modelManage/cesiumBaseModel',
            name: 'cesium基本模型',
            component: () => import('../views/modelManage/CesiumBaseModel.vue'),
        },
        {
            path: '/modelManage/mapBoxBaseModel',
            name: 'mapbox基本模型',
            component: () => import('../views/modelManage/MapBoxBaseModel.vue'),
        },
        {
            path: '/modelManage/mapBoxCityModel',
            name: 'mapbox城市模型',
            component: () => import('../views/modelManage/MapBoxCityModel.vue'),
        },
        {
            path: '/modelManage/cesiumCityModel',
            name: 'cesium城市模型',
            component: () => import('../views/modelManage/CesiumCityModel.vue'),
        }

    ]
});
