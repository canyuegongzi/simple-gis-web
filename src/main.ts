import Vue from 'vue';
import Main from './views/Main.vue';
import store from './store';
import './service/http.ts';
import './style/index.css';
import { router } from "./router";
import ElementUI from 'element-ui';
Vue.use(ElementUI);
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(Main),
}).$mount('#root');
