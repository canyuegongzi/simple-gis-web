<template lang="pug">
    .base-layout-container
        LayerControlWidget(@change="buttonClick('SETTING')")
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import LayerControlWidget from '../controlWidget/LayerControlWidget.vue';

@Component({
    name: 'BaseLayout',
    components: { LayerControlWidget }
})
export default class BaseLayout extends Vue {
    private valueNum: number = 0

    @Emit('changeClick')
    public buttonClick(type: string) {
        return { type, data: {} };
    }
}
</script>

<style lang="stylus" scoped>
.base-layout-container
    position absolute
    top 0
    right 0
    z-index: 2;
    background: transparent;
</style>
