import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import APPModule from './module/app';

Vue.use(Vuex);
export default new Vuex.Store({
    // plugins,
    modules: {
        'appModule': APPModule
    },
    state: {},
    mutations: {},
    actions: {}

});
