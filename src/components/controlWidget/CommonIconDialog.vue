<template lang="pug">
    .dialog-button-icon(@click="emitEvent")
        .el-icon-bangzhu
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component({
    name: 'CommonIconDialog'
})
export default class CommonIconDialog extends Vue {
    private valueNum: number = 0

    @Emit('change')
    private emitEvent() {
        return 'SETTING';
    }
}
</script>

<style lang="stylus" scoped>
.dialog-button-icon
    width 32px
    height 32px
    font-size 28px
    position absolute
    left 48px
    top 16px
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,.9);
    border-radius 16px
    cursor pointer
    .el-icon-bangzhu
        font-size 24px
</style>
