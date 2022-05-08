<template>
  <div class="_setting_container">
    <el-icon style="vertical-align: middle;color: #304156" class="icon" @click="tapSetting">
      <setting />
    </el-icon>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'SettingLayoutIcon',
  emits:['tapSetting'],
  setup(prop, context) {
    const tapSetting = () => {
      context.emit('tapSetting')
    }
    return {
      tapSetting
    }
  },
  components: {},
});
</script>

<style scoped>
._setting_container {
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 7000 !important;
  color: #ffffff;
}
._setting_container .icon {
  width: 100%;
  height: 100%;
  font-size: 24px;
  cursor: pointer;
}
</style>
