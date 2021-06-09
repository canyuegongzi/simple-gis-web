/**
 * 高德地图图层
 */
import { WebMercatorTilingScheme, WebMercatorProjection, Math, Cartographic, Cartesian2 } from 'cesium';
import CoordTransform from '../../../../utils/CoordTransform';

class AmapMercatorTilingScheme extends WebMercatorTilingScheme {
    constructor(options: any = {}) {
        super(options);
        let projection: WebMercatorProjection = new WebMercatorProjection();
        (this.projection as any).project = function(cartographic: any, result: any) {
            result = CoordTransform.WGS84ToGCJ02(
                Math.toDegrees(cartographic.longitude),
                Math.toDegrees(cartographic.latitude)
            );
            result = projection.project(
                new Cartographic(
                    Math.toRadians(result[0]),
                    Math.toRadians(result[1])
                )
            );
            return new Cartesian2(result.x, result.y);
        };
        (this.projection as any).unproject = function(cartesian: any, result: any) {
            let cartographic = projection.unproject(cartesian);
            result = CoordTransform.GCJ02ToWGS84(
                Math.toDegrees(cartographic.longitude),
                Math.toDegrees(cartographic.latitude)
            );
            return new Cartographic(
                Math.toRadians(result[0]),
                Math.toRadians(result[1])
            );
        };
    }
}

export default AmapMercatorTilingScheme;
