
import { Module,VuexModule,Mutation,Action,getModule, MutationAction } from 'vuex-module-decorators';
@Module({
    name: 'appModule',
    namespaced: true,
    // stateFactory: true
})
export default class AppStoreModule extends VuexModule {
    public vuexStatus: number = 0;

    @Mutation
    public setVuexStatus(val: number) {
        this.vuexStatus = val;
    }

    @Action({ commit: 'setVuexStatus' })
    public commitVuexStatus() {
        return 6;
    }

    get vuexStoreValue() {
        return this.vuexStatus;
    }
}
