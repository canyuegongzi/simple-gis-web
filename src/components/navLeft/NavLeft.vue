<template>
    <div style="height: 100%">
        <el-menu
            :collapse="isSidebarNavCollapse"
            text-color="#eee"
            active-text-color="#4dbcff"
            :default-active="currentMenu?.path"
            class="theme-bg"
            id="menu"
            :unique-opened="true"
        >
            <MENU :menuList="sidebarMenu"></MENU>
        </el-menu>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import MENU from "./menu.vue";

export default defineComponent({
    props: {
      sidebarMenu: {
          type: Array,
          default: () => []
      },
      currentMenu: {
          type: Object,
          default: () => {}
      },
      isSidebarNavCollapse: {
          type: Boolean,
          default: true
      }
    },
    setup() {

    },
    components: {
        MENU,
    },
});
</script>
