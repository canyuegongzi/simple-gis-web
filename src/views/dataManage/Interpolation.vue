<template lang="pug">
    .pug-container
        p 插值渲染
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class InterpolationPage extends Vue {
}
</script>

<style scoped lang="stylus">
.pug-container
    background transparent
    z-index 888 !important
    position absolute
    top 0
</style>
