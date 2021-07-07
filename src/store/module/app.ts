
import { Module, VuexModule, Mutation, Action, getModule, MutationAction } from 'vuex-module-decorators';
import { MapTypeEnum } from '@/map/type/CommonType';
@Module({
    name: 'appModule',
    namespaced: true,
    // stateFactory: true
})
export default class AppStoreModule extends VuexModule {
    public vuexStatus: number = 0;

    public mapType: MapTypeEnum = 'CESIUM';

    @Mutation
    public setVuexStatus(val: number) {
        this.vuexStatus = val;
    }

    @Mutation
    public setMapType(val: MapTypeEnum) {
        this.mapType = val;
    }

    @Action({ commit: 'setVuexStatus' })
    public commitVuexStatus() {
        return 6;
    }

    get vuexStoreValue() {
        return this.vuexStatus;
    }
}
