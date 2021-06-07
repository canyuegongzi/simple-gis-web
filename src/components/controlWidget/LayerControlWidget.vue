<template lang="pug">
    .layer-button(@click="emitEvent")
       i.el-icon-setting
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component({
    name: 'LayerControlWidget'
})
export default class LayerControlWidget extends Vue {
    private valueNum: number = 0

    @Emit('change')
    private emitEvent() {
        console.log('444');
        return 'SETTING';
    }
}
</script>

<style lang="stylus" scoped>
.layer-button
    width 32px
    height 32px
    font-size 28px
    position absolute
    right 16px
    top 16px
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,.15);
    border-radius 16px
</style>
