import { BaseEvent } from "../common/BaseEvent";
import {MapInitEvent} from "../interface";

export class EventService extends BaseEvent implements MapInitEvent{
    constructor() {
        super();
    }

    /**
     * 初始化地图事件系统
     * @param args
     */
    public initEvent(args: any): void {

    }
}
