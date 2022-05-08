import {CommonStoreState} from "./index";

const getters={
    mapType: (state: CommonStoreState) => state.mapType,
    settingStatus: (state: CommonStoreState) => state.settingStatus,
    currentMenu: (state: CommonStoreState) => state.currentMenu,
}
export default getters
