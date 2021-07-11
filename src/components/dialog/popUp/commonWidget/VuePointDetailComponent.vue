<template lang="pug">
    div.pop-container-map(id="popUpContainer" style="")
        .pop-up-title-header
            .close.el-icon-close(@click="closePopUpFunction")
        .pop-up-content
            .pop-up-row-item
                .label 名称：
                .value {{info.name}}

</template>

<script lang="ts">
import { Vue, Component, Emit, Prop } from 'vue-property-decorator';

@Component({
    name: 'VuePointDetailComponent'
})
export default class VuePointDetailComponent extends Vue {

    @Prop({ type: Object, default: () => {} })
    public info!: string;

    @Prop({ type: Function, default: function(){} })
    public closePopUp!: any;

    public closePopUpFunction() {
        if (typeof this.closePopUp === 'function') {
            this.closePopUp();
        }
    }

}
</script>

<style scoped lang="stylus">
.pop-container-map
    background #ffffff
    border-radius 8px
    width: 250px;
    height: 100px;
    position: absolute;
    left: 0;
    bottom: 0
    .pop-up-title-header
        height 28px
        background #cdcdcd;
        border-top-left-radius 8px
        border-top-right-radius 8px
        .close
            position absolute
            right 8px
            top 8px
            cursor pointer
    .pop-up-content
        padding 8px
        .pop-up-row-item
            display flex
            flex-direction row
            .label
                font-size 14px
            .value
                font-size 14px
</style>
