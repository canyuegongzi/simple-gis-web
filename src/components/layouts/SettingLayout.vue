<template lang="pug">
   .slide-container-setting
       .title1
            span 设置
       .item-group
           .item-group-title
               span 地图类型
           .item-group-content
               el-radio-group(v-model="mapType" @change="(val) => settingChange('AMP_TYPE_CHANGE', val)")
                   el-radio(:label="item" :key="item" v-for="(item, index) in mapTypeList") {{item}}
       .item-group
           .item-group-title
               span 工具
</template>

<script lang="ts">
import { MapTypeEnum, MapTypeList } from '../../map/type/CommonType';
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component({
    name: 'SettingLayout',
})
export default class BaseLayout extends Vue {
    private valueNum: number = 0
    private mapTypeList = MapTypeList;
    private mapType: MapTypeEnum = 'LEAFLET';

    @Emit('changeClick')
    private settingChange(type: string, val: any) {
        return { type, data: val };
    }
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
