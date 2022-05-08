<template>
  <div class="common-popup-container">
    <CommonIconDialog v-show="showIcon" @change="changePopupStatus"></CommonIconDialog>
    <div v-show="!showIcon" class="common-popup-container-content">
      <el-icon class="close-icon" @click="changePopupStatus">
        <close />
      </el-icon>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import CommonIconDialog from "../common/CommonIconDialog.vue";

export default defineComponent({
  name: 'CommonPopup',
  setup() {
    const showIcon = ref(true);
    const changePopupStatus = () => {
      showIcon.value = !showIcon.value;
    }
    return {
      showIcon,
      changePopupStatus
    }
  },
  components: {
    CommonIconDialog
  },
});
</script>

<style scoped>
.close-icon {
  position: absolute;
  right: 8px;
  top: 8px;
  cursor: pointer;
  font-size: 18px;
}
</style>
