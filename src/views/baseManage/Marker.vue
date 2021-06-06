<template lang="pug">
    .pug-container
        p 打点
        p 打点
        p 打点
        p 打点
        p 打点
        p 打点
        p 打点
        p 打点
        p 打点
        p 打点
        p 打点
        p 打点
        p 打点
        p 打点
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class Marker extends Vue {}
</script>

<style scoped lang="stylus">
.pug-container
    height 100%
    width 200px
    background transparent
    z-index 9999 !important
    position absolute
    top 0
</style>
