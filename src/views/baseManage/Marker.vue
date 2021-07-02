<template lang="pug">
    .pug-container
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class Marker extends Vue {}
</script>

<style scoped lang="stylus">
.pug-container
    background transparent
    z-index 888 !important
    position absolute
    top 0
</style>
