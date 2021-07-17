<template lang="pug">
    div()
        CommonIconDialog(@change="changeStatus" v-show="!showFormContent")
        div(class="drag marker-container" style="background: #ffffff" v-draw v-show="showFormContent")
            i.el-icon-close.close(@click="changeStatus")
            .buttons-container
                //p.title 鼠标绘制
                //el-radio-group(v-model="allowMouseRender")
                //    el-radio(:label="true") 是
                //    el-radio(:label="false") 否
                p.title(v-show="allowMouseRender === false") 绘制类型
                el-radio-group(v-model="renderType" v-show="allowMouseRender === false")
                    // el-radio(label="entity") 普通
                    el-radio(label="geo") geo
            p.title 操作
            .buttons
                el-button(type="primary" size="mini" @click="tapEvent('renderLine')") 渲染
                el-button(type="primary" size="mini" @click="tapEvent('mouseRenderLine')" v-if="allowMouseRender") 鼠标绘制
                el-button(type="primary" size="mini" @click="tapEvent('deleteLine')") 删除


</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import CommonIconDialog from '../../../components/controlWidget/CommonIconDialog.vue';

@Component({
    name: 'MapboxLineDialog',
    components: {
        CommonIconDialog
    }
})
export default class MapboxLineDialog extends Vue {
    public visible = true;
    public allowMouseRender = false;  // 允许鼠标绘制
    public markerType = 1;
    public styleType = 1;
    public renderType = 'geo';
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
                renderType: this.renderType
            }
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
