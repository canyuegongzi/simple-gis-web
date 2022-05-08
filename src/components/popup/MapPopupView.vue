<template>
  <div class="pop-container-map" id="popUpContainer" style="">
    <div class="pop-up-title-header">
      <div class="close" @click="closePopUpFunction">
        <el-icon class="close-icon" >
          <Close />
        </el-icon>
      </div>

    </div>
    <div class="pop-up-content">
      <div class="pop-up-row-item">
        <div class="label">名称：</div>
        <div class="value">{{info.name}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import { Close } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'MapPopupView',
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    closePopUp: {
      type: Function,
    }
  },
  setup(props: any) {
    const closePopUpFunction = () => {
      if (typeof props.closePopUp === 'function') {
        props.closePopUp();
      }
    }

    return {
      closePopUpFunction
    }
  },
  components: {
    Close
  },
});
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
      width 16px
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
