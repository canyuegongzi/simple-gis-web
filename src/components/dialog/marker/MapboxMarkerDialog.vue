<template lang="pug">
    div(class="drag marker-container" style="background: #ffffff" v-draw)
        .buttons-container
            p.title 点位类型
            el-radio-group(v-model="markerType")
                el-radio(:label="1") 普通
                el-radio(:label="2") 聚合
            p.title(v-show="markerType === 1") 点位样式
            el-radio-group(v-model="styleType" v-show="markerType === 1")
                el-radio(:label="1") 图层渲染
                el-radio(:label="2") 资源渲染
        .buttons
            el-button(type="primary" size="mini" @click="tapEvent('MARKER')") 更新
            el-button(type="primary" size="mini" @click="tapEvent('CLEAR')") 清空

</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';

@Component({})
export default class MapboxMarkerDialog extends Vue {
    public visible = true;
    public markerType = 1;
    public styleType = 1;

    /**
     * 事件
     * @param type
     */
    @Emit('map:event')
    public tapEvent(type: string) {
        return {
            action: type,
            data: {
                markerType: this.markerType,
                styleType: this.styleType,
            },
        };
    }
}
</script>

<style scoped lang="stylus">
.marker-container
    background #ffffff
    top: 80px
    left: 200px
    z-index 9000 !important
    width: 320px;
    height: 420px;
    border-radius: 16px;
    padding: 0 16px 16px 16px;

    .title
        font-size: 14px;
        font-weight: 700;
        color: #3c4a54;
        padding-bottom: 16px;
        padding-top: 16px;

    .buttons
        margin-top 16px
        display flex
        justify-content: flex-start;
</style>
