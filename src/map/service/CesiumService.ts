import MapService from "../common/MapService";
import { CesiumInstanceOptions } from '@/map/type/CesiumType';

export default class CesiumService extends MapService {
    constructor(props: CesiumInstanceOptions) {
        super();
    }
}
