<template>
  <div class="view-page-common-container">
    <CommonPopup>
      <template #default>
        <div>
          空间测量
        </div>
      </template>

    </CommonPopup>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import CommonPopup from "../components/popup/CommonPopup.vue";

export default defineComponent({
  name: 'SpaceSurveyingView',
  components: {
    CommonPopup
  },
});
</script>

<style scoped>
</style>
