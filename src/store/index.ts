import { createStore } from "vuex";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
import {MapTypeEnum} from "../type";
export interface CommonStoreState {
    mapType: MapTypeEnum,
    settingStatus: boolean,
    currentMenu: any,
}
export default createStore({
    state: {
        mapType: 'MAPBOX',
        settingStatus: false,
        currentMenu: {}
    } as CommonStoreState,
    mutations,
    actions,
    getters,
});
