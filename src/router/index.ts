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
            component: () => import('../views/baseManage/Marker.vue'),
        },
        {
            path: '/baseManage/line',
            component: () => import('../views/baseManage/Line.vue'),
        }

    ]
});
