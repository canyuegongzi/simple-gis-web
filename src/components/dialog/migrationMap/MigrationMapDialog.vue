<template lang="pug">
    div()
        CommonIconDialog(@change="changeStatus" v-show="!showFormContent")
        div(class="drag marker-container" style="background: #ffffff" v-draw v-show="showFormContent")
            i.el-icon-close.close(@click="changeStatus")
            .buttons-container
                p.title() 绘制类型
                el-radio-group(v-model="renderType")
                    el-radio(label="entity") 普通
                p.title() 迁徙图类型
                el-radio-group(v-model="dataType")
                    el-radio(label="SOLID") 固废数据
                p.title() 技术栈
                el-radio-group(v-model="skillType")
                    el-radio(label="ECHARTS") echarts
            p.title 操作
            .buttons
                el-button(type="primary" size="mini" @click="tapEvent('render')") 迁徙
                el-button(type="primary" size="mini" @click="tapEvent('delete')") 删除


</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import CommonIconDialog from '../../../components/controlWidget/CommonIconDialog.vue';
import { MigrationMapDialogDataTypeInstance, MigrationMapDialogSkillTypeInstance } from '@/components/dialog/migrationMap/MigrationMapDialogInstance';
type InterpolationType = 'TEMPERATURE_CHAIN' | 'WATER_LEVEL_HZ';

@Component({
    name: 'MigrationMapDialog',
    components: {
        CommonIconDialog
    }
})
export default class MigrationMapDialog extends Vue {
    public visible = true;
    public type: InterpolationType = 'TEMPERATURE_CHAIN';
    public allowMouseRender = false;  // 允许鼠标绘制
    public markerType = 1;
    public styleType = 1;
    public renderType = 'entity';  // 渲染类型
    public dataType: MigrationMapDialogDataTypeInstance = 'SOLID';  // 数据类型
    public skillType: MigrationMapDialogSkillTypeInstance = 'ECHARTS';  // 技术类型
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
                type: this.dataType,
                renderType: this.renderType,
                dataType: this.dataType,
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
    z-index 2000 !important
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
