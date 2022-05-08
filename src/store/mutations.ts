import {MapTypeEnum} from "../type";
import {CommonStoreState} from "./index";

const mutations = {
    /**
     * 设置地图类型
     * @param state
     * @param mapType
     */
    setMapType(state: CommonStoreState, mapType: MapTypeEnum) {
        state.mapType = mapType;
    },

    /**
     * 设置状态
     * @param state
     * @param val
     */
    setSettingStatus(state: CommonStoreState, val: boolean) {
        state.settingStatus = val;
    },

    /**
     * 设置状态
     * @param state
     * @param val
     */
    setCurrentMenu(state: CommonStoreState, val: boolean) {
        state.currentMenu = val;
    }
}
export default mutations
