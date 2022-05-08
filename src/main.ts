import { createApp } from 'vue'
import { Setting, Grid, Close, Delete, Tools } from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "./styles/index.scss";
import "./styles/color/index.scss";
import App from './App.vue'
import router from "./router";
import store from "./store";

const app = createApp(App)
app.use(store)
app.use(ElementPlus)
app.use(router)
app.component('setting', Setting)
app.component('delete', Delete)
app.component('grid', Grid)
app.component('close', Close)
app.component('tools', Tools)
app.mount('#app')
