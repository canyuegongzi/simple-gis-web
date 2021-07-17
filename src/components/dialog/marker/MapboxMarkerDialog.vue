<template lang="pug">
    div()
        CommonIconDialog(@change="changeStatus" v-show="!showFormContent")
        div(class="drag marker-container" style="background: #ffffff" v-draw v-show="showFormContent")
            i.el-icon-close.close(@click="changeStatus")
            .buttons-container
                p.title 点位类型
                el-radio-group(v-model="markerType")
                    el-radio(:label="1") 普通
                    el-radio(:label="2") 聚合
                p.title(v-show="markerType === 1") 点位样式
                el-radio-group(v-model="styleType" v-show="markerType === 1")
                    el-radio(:label="1") 图层渲染
                    el-radio(:label="2") 资源渲染
            p.title 操作
            .buttons
                el-button(type="primary" size="mini" @click="tapEvent('MARKER')") 更新
                el-button(type="primary" size="mini" @click="tapEvent('CLEAR')") 清空

</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import CommonIconDialog from '../../../components/controlWidget/CommonIconDialog.vue';

@Component({
    components: {
        CommonIconDialog
    }
})
export default class MapboxMarkerDialog extends Vue {
    public visible = true;
    public markerType = 1;
    public styleType = 1;
    public showFormContent: boolean = true; // 是否显示

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
    /**
     * 显示状态修改
     * @param status
     */
    public changeStatus(status: string) {
        this.showFormContent = !this.showFormContent;
    }

}
</script>

<style scoped lang="stylus">
.close
    position absolute
    top 16px
    right 16px
    cursor pointer
    font-size 18px
.marker-container
    background #ffffff
    top: 16px
    left: 200px
    z-index 9000 !important
    width: 320px;
    height: 420px;
    border-radius: 16px;
    padding: 0 16px 16px 16px;
    border: 1px solid #909399;

    .title
        font-size: 14px;
        font-weight: 700;
        color: #3c4a54;
        padding-bottom: 16px;
        padding-top: 16px;

    .buttons

        display flex
        justify-content: flex-start;
</style>
