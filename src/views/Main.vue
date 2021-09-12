<template lang="pug">
    div(id="root-view")
        el-container(style="height: 100%")
            el-aside(width="200px" style="height: 100%")
                Aside(:menus="menus")
            el-container()
                el-main(style="padding: 0" id="main-content-container")
                    #map-base-container
                        LeafletView(v-show="mapType === 'LEAFLET'" ref="LeafletView")
                        MapBoxView(v-show="mapType === 'MAPBOX'"  ref="MapBoxView")
                        CesiumView(v-show="mapType === 'CESIUM'"  ref="CesiumView")
                        BaseLayout(@changeClick="layoutButtonClick")
                        el-drawer(
                            :modal-append-to-body="false"
                            title="我是标题"
                            :visible.sync="settingOpenStatus"
                            direction="rtl"
                            :with-header="false"
                            )
                            SettingLayout(@changeClick="layoutButtonClick")
                    router-view(id="root-main")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Aside from '../components/aside/Index.vue';
import LeafletView from '../components/map/LeafletView.vue';
import MapBoxView from '../components/map/MapBoxView.vue';
import CesiumView from '../components/map/CesiumView.vue';
import BaseLayout from '../components/layouts/BaseLayout.vue';
import SettingLayout from '../components/layouts/SettingLayout.vue';
import { data } from '../components/aside/nav';
import { MapTypeEnum } from '../map/type/CommonType';
import { namespace } from 'vuex-class';

const appModule = namespace('appModule');

@Component({
    components: {
        Aside,
        LeafletView,
        MapBoxView,
        CesiumView,
        BaseLayout,
        SettingLayout,
    },
})
export default class Main extends Vue {
    public menus: any = data.list;

    @appModule.State
    public mapType!: MapTypeEnum;

    public settingOpenStatus: boolean = false;

    @appModule.Mutation
    private setMapType!: (number: MapTypeEnum) => void;

    public $refs!: {
        LeafletView: HTMLFormElement;
        MapBoxView: HTMLFormElement;
        CesiumView: HTMLFormElement;
    };

    public controlMapType(val: MapTypeEnum) {
        console.log(val);
        this.setMapType(val);
        switch (val) {
        case 'LEAFLET':
            this.$refs.LeafletView.initMap();
            break;
        case 'MAPBOX':
            this.$refs.MapBoxView.initMap();
            break;
        case 'CESIUM':
            this.$refs.CesiumView.initMap();
        }
    }

    /**
     * 布局按钮点击
     * @param data
     */
    public layoutButtonClick(data: {type: string, data: any}) {
        console.log(data);
        switch (data.type) {
        case 'SETTING':
            this.settingOpenStatus = !this.settingOpenStatus;
            break;
        case  'AMP_TYPE_CHANGE':
            this.controlMapType(data.data);
            break;
        case 'SYSTEM_OPERATE':
            this.systemHandler(data.data);
            break;

        }
    }

    /**
     * 地图系统操作
     * @param data
     */
    public systemHandler(data: string) {
        console.log(data);
        if (data === 'destroy') {

            console.log('数据销毁');
        }
        if (data === 'create') {
            console.log('创建');
        }
    }

    public mounted() {
        this.controlMapType('MAPBOX');
    }
}
</script>

<style lang="stylus">
#root-view
    height: 100%;
    width: 100%;
.fade-enter-active .fade-leave-active
    transition opacity .5s
.fade-enter .fade-leave-active
    opacity 0

.transitionRouter-enter-active .transitionRouter-leave-active
    transition all 0.4s
.transitionRouter-enter .transitionRouter-leave
    transform translate3d(100%, 0, 0)
#main-content-container
    position relative;
    width 100%
    height 100%
    #map-base-container
        height 100%
        width 100%
        position absolute;
        top 0;
        right 0
        z-index 0
        #root-main
            z-index 9999 !important
</style>
<style lang="stylus">
.app-custom-loading
    z-index 99999 !important
</style>
