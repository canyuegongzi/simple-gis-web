<template lang="pug">
   .slide-container-setting
       .title1
            span 设置
       .item-group
           .item-group-title
               span 地图类型
           .item-group-content
               el-radio-group(v-model="tempMapType" @change="(val) => settingChange('AMP_TYPE_CHANGE', val)")
                   el-radio(:label="item" :key="item" v-for="(item, index) in mapTypeList") {{item}}
       .item-group
           .item-group-title
               span 工具
</template>

<script lang="ts">
import { MapTypeEnum, MapTypeList } from '../../map/type/CommonType';
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const appModule = namespace('appModule');
@Component({
    name: 'SettingLayout',
})
export default class BaseLayout extends Vue {
    private mapTypeList = MapTypeList;
    private tempMapType: MapTypeEnum = 'CESIUM';

    @Watch('mapType')
    public mapTypeChange(val: MapTypeEnum) {
        this.tempMapType = val;
    }

    @appModule.State
    public mapType!: MapTypeEnum;

    @Emit('changeClick')
    private settingChange(type: string, val: MapTypeEnum) {
        this.setMapType(val);
        return { type, data: val };
    }

    @appModule.Mutation
    private setMapType!: (number: MapTypeEnum) => void;
}
</script>

<style lang="stylus" scoped>
.slide-container-setting
    padding 16px 0 16px 0
    .title1
        display inline-block
        width 100%
        text-align center
        padding-bottom 16px
    .item-group
        .item-group-title
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 24px;
            line-height: 24px;
            padding: 0 16px 0 8px;
            margin-top 8px
            background-color: #dcdfe6;
        .item-group-content
            padding 16px 16px 8px 16px
</style>
