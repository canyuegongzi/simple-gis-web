<template lang="pug">
    div()
        CommonIconDialog(@change="changeStatus" v-show="!showFormContent")
        div(class="drag marker-container" style="background: #ffffff" v-draw v-show="showFormContent")
            i.el-icon-close.close(@click="changeStatus")
            //.buttons-container
            //    p.title 点位类型
            //    p.title(v-show="markerType === 1") 点位样式
            p.title 操作
            .buttons
                el-button(type="primary" size="mini" @click="tapEvent('renderMarker')") 渲染点位
                el-button(type="primary" size="mini" @click="tapEvent('deleteMarker')") 删除点位
                // el-button(type="primary" size="mini" @click="tapEvent('open')") 打开弹框
                el-button(type="primary" size="mini" @click="tapEvent('close')") 关闭弹窗

</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import CommonIconDialog from '../../../components/controlWidget/CommonIconDialog.vue';

@Component({
    name: 'LeafletPopUpDialog',
    components: {
        CommonIconDialog
    }
})
export default class LeafletPopUpDialog extends Vue {
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
            action: type
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
    border: 1px solid #909399;
    top: 16px
    left: 200px
    z-index 9000 !important
    width: 300px;
    height: 300px;
    border-radius: 16px;
    padding: 0 16px 16px 16px;

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
