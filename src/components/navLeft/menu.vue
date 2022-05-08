<template>
    <div class="menu-container">
        <template v-for="v in state.menuList" :key="v.name">
            <div v-if="v.children && v.children.length > 0 ">
                <!-- 外层 -->
                <el-sub-menu :index="v.name" :key="v.name" class="theme-bg" v-if="!v.meta.hide">
                    <template #title>
                        <i
                            class="iconfont theme-color"
                            :class="v.meta.icon"
                        ></i>
                        <span class="theme-color">{{ v.name }}</span>
                    </template>
                    <el-menu-item-group>
                        <my-nav :menuList="v.children"></my-nav>
                    </el-menu-item-group>
                </el-sub-menu>
            </div>
            <div v-else>
                <!-- 内层 -->
                <el-menu-item
                    v-if="!v.meta.hide"
                    :key="v.name"
                    :index="v.name"
                    @click="gotoRoute(v)"
                    class="theme-bg"
                >
                    <i class="iconfont theme-color" :class="v.meta.icon"></i>
                    <span class="theme-color">{{ v.name }}</span>
                </el-menu-item>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
    name: "my-nav",
    props: {
        menuList: {
            type: Array,
            default: () => [],
        },
    },
    setup(props: any) {
        let state = reactive({
            menuList: props.menuList,
        });
        let router = useRouter();
        let gotoRoute = (item: any) => {
            router.push(item.path);
        };
        return {
            state,
            gotoRoute,
        };
    },
});
</script>
