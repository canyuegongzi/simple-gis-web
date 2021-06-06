<template lang="pug">
  .home-container
      p 这是首页列表
      HelloWorldComponent(:title="parentTitle" :propA="1" @valueChange="childValueChange")
      p(style="margin: 16px 0") 这是store中的数据: {{vuexStatus}}
      button(@click="() => setVuexStatus(vuexStatus + 1)") 改变store数据
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import HelloWorldComponent from "../../components/mini/HelloWorldComponent";
import { namespace } from 'vuex-class';
const appModule = namespace('appModule');
@Component({
    name: 'HomeList',
    components: {
        'HelloWorldComponent': HelloWorldComponent
    }
})
export default class HomeList extends Vue {
    protected parentTitle: string = '这是父组件传递的title';

    private childValueChange(value: number) {
        console.log('父组件接受到子组件的值', value);
    }

    @appModule.State
    public vuexStatus!: number;

    @appModule.Mutation
    private setVuexStatus!: (number: number) => void

    created() {
        console.log('组件初化');
        console.log(appModule);
    }
}
</script>

<style scoped lang="stylus">
.home-container
    padding 16px
</style>
