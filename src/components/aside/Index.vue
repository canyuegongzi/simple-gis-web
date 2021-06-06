<template lang="pug">
    .container
        el-scrollbar(style="height:100%;" class="fpi-scroll")
            el-menu(default-active="0" class="el-menu-vertical-demo" @select="menuSelected" @open="open" background-color="#19202e" text-color="#ffffff" active-text-color="#1989f8" :router="true")
                SlideTree(:navMenus="menus")
</template>

<script lang="ts">
import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
import SlideTree from './SlideTree.vue';

@Component({
    components: {
        SlideTree
    },
})
export default class Aside extends Vue {
        @Prop({ type: Array, default: () => { return []; } })
        private menus: any;

        private created() {

        }

        private menuSelected(val: (number | string), indexPath: string[] ) {

            // try {
            //   if (this.$route.path != '/' + indexPath.join('/')) {
            //     this.$router.push('/' + indexPath.join('/'));
            //   }
            // } catch (e) {
            //   if (this.$route.path != '/' + indexPath.join('/')) {
            //     this.$router.push('/' + indexPath.join('/'));
            //   }
            // }
        }

        private open(val: (number | string), indexPath: string[] ) {
        }
}
</script>

<style lang="stylus" scoped>
    .container
        height 100%
        width 100%
        background-color #19202e
        .el-menu-vertical-demo
            height 100%
</style>
