import { Module, VuexModule, Mutation, Action, getModule, MutationAction } from 'vuex-module-decorators';
import { MapTypeEnum } from '@/map/type/CommonType';
import CesiumService from '@/map/service/CesiumService';
import LeafletService from '@/map/service/LeafletService';
import MapBoxService from '@/map/service/MapBoxService';

@Module({
    name: 'appModule',
    namespaced: true,
    // stateFactory: true
})
export default class AppStoreModule extends VuexModule {
    public vuexStatus: number = 0;

    public mapType: MapTypeEnum = 'MAPBOX';

    private cesiumMapInstance: CesiumService | null = null;

    public leafletMapInstance: LeafletService | null = null;

    public mapBoxMapInstance: MapBoxService | null = null;

    @Mutation
    public setVuexStatus(val: number) {
        this.vuexStatus = val;
    }

    @Mutation
    public setMapInstance(data: { mapType: MapTypeEnum, instance: any }) {
        switch (data.mapType) {
        case 'CESIUM':
            this.cesiumMapInstance = data.instance;
            break;
        case 'LEAFLET':
            this.leafletMapInstance = data.instance;
            break;
        case 'MAPBOX':
            this.mapBoxMapInstance = data.instance;
            break;
        }
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
