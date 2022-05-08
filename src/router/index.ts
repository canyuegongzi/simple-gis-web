import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Main",
        redirect: {
            path: '/baseManage/PointView'
        },
    },
    {
        path: "/baseManage/PointView",
        name: "PointView",
        component: () => import("../views/PointView.vue"),
    },
    {
        path: "/baseManage/LineView",
        name: "LineView",
        component: () => import("../views/LineView.vue"),
    },
    {
        path: "/baseManage/PolygonView",
        name: "Polygon",
        component: () => import("../views/PolygonView.vue"),
    },
    {
        path: "/baseManage/PopupView",
        name: "CoverView",
        component: () => import("../views/PopupView.vue"),
    },

    {
        path: "/handlerManage/HandlerMarkerView",
        name: "HandlerMarkerView",
        component: () => import("../views/HandlerMarkerView.vue"),
    },
    {
        path: "/handlerManage/SpaceSurveyingView",
        name: "SpaceSurveyingView",
        component: () => import("../views/SpaceSurveyingView.vue"),
    },



];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
