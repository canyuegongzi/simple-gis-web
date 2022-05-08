<template>
    <div class="dialog-button-icon" @click="emitEvent">
      <div class="el-icon-bangzhu">
        <el-icon style="color: #304156">
          <grid />
        </el-icon>
      </div>
    </div>

</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'CommonIconDialog',
  emits:['change'],
  setup(prop, context) {
    const emitEvent = () => {
      context.emit('change')
    }
    return {
      emitEvent
    }
  },
  components: {},
});
</script>

<style lang="stylus" scoped>
.dialog-button-icon
    width 32px
    height 32px
    font-size 28px
    display: flex;
    line-height 32px;
    text-align center;
    border-radius 16px;
    align-items: center;
    justify-content center;
    cursor pointer
    .el-icon-bangzhu
        font-size 24px
</style>
