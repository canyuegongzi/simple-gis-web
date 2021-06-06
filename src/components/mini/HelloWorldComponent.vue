<template lang="pug">
    .hello-world
        p {{title}}
        p(style="margin-top: 16px;margin-bottom: 16px") {{valueNum}}
        button(@click="emitEvent") 点击
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component({
    name: 'HelloWorldComponent'
})
export default class HelloWorldComponent extends Vue {
    private valueNum: number = 0
    @Prop({ default: 'World' })
    protected title: string;

    @Prop(Number)
    protected readonly propA: number | undefined

    @Emit('valueChange')
    private emitEvent() {
        this.valueNum ++;
        return this.valueNum;
    }

    created() {
        console.log(this.propA);
    }
}
</script>

<style>
#main {
    height: 100%;
    width: 100%;
}
</style>
