<template lang="pug">
    div(id="root-view")
        el-container(style="height: 100%")
            el-aside(width="200px" style="height: 100%")
                Aside(:menus="menus")
            el-container()
                el-main(style="padding: 0" id="main-content-container")
                    #map-base-container
                        LeafletView(v-show="mapType === 'LEAFLET'")
                    router-view(id="root-main")
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Aside from '../components/aside/Index.vue';
import LeafletView from '../components/map/LeafletView.vue';
import { data } from '../components/aside/nav';
import { MapTypeEnum } from '@/map/type/CommonType';

@Component({
    components: {
        Aside,
        LeafletView
    }
})
export default class Main extends Vue {
    public menus: any = data.list;
    public mapType: MapTypeEnum = 'LEAFLET'
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
