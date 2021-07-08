<template lang="pug">
    .pug-container
        p 弹框
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class PopUpPage extends Vue {
}
</script>

<style scoped lang="stylus">
.pug-container
    height 100%
    width 100%
    background rebeccapurple
</style>
