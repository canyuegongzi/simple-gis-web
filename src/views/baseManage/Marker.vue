<template lang="pug">
    .pug-container
        CesiumMarkerDialog(@map:event="mapEvent")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { MapTypeEnum } from '@/map/type/CommonType';

const appModule = namespace('appModule');
@Component({
    components: {},
})
export default class Marker extends Vue {

    @appModule.State
    public mapType!: MapTypeEnum;

    @appModule.Mutation
    private setMapType!: (number: MapTypeEnum) => void;
}
</script>

<style scoped lang="stylus">
.pug-container
    background transparent
    z-index 888 !important
    position absolute
    top 0
</style>
