import { MapTypeEnum } from '../type/CommonType';

class CommonStore {
    public mapInstanceMap: Map<string, any> = new Map();
    /**
     * 读取地图实例
     * @param type
     * @protected
     */
    public async getInstance(type: MapTypeEnum) {
        if (this.mapInstanceMap.get(type)) {
            return this.mapInstanceMap.get(type);
        }
    }

    /**
     * 保存地图实例
     * @param type
     * @param instance
     */
    public setInstance(type: MapTypeEnum, instance:any) {
        this.mapInstanceMap.set(type, instance);
    }
}
export default new CommonStore();
