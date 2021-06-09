/**
 * @Author: Caven
 * @Date: 2021-01-31 19:22:04
 */
import { WebMercatorTilingScheme, Rectangle, defined, Math as CesiumMath, Cartographic, Cartesian2 } from 'cesium';
import BaiduMercatorProjection from './BaiduMercatorProjection';
import CoordTransform from '../../../../utils/CoordTransform';

class BaiduMercatorTilingScheme extends WebMercatorTilingScheme {
    public resolutions: number[] = [];
    constructor(options: any = {}) {
        super(options);
        let projection = new BaiduMercatorProjection();
        (this.projection as any).project = function(cartographic:any, result: any) {
            result = result || {};
            result = CoordTransform.WGS84ToGCJ02(
                CesiumMath.toDegrees(cartographic.longitude),
                CesiumMath.toDegrees(cartographic.latitude)
            );
            result = CoordTransform.GCJ02ToBD09(result[0], result[1]);
            result[0] = Math.min(result[0], 180);
            result[0] = Math.max(result[0], -180);
            result[1] = Math.min(result[1], 74.000022);
            result[1] = Math.max(result[1], -71.988531);
            result = projection.lngLatToPoint({
                lng: result[0],
                lat: result[1]
            });
            return new Cartesian2(result.x, result.y);
        };
        (this.projection as any).unproject = function(cartesian: any, result: any) {
            result = result || {};
            result = projection.mercatorToLngLat({
                lng: cartesian.x,
                lat: cartesian.y
            });
            result = CoordTransform.BD09ToGCJ02(result.lng, result.lat);
            result = CoordTransform.GCJ02ToWGS84(result[0], result[1]);
            return new Cartographic(
                CesiumMath.toRadians(result[0]),
                CesiumMath.toRadians(result[1])
            );
        };
        this.resolutions = options.resolutions || [];
    }

    /**
     *
     * @param x
     * @param y
     * @param level
     * @param result
     * @returns {module:cesium.Rectangle|*}
     */
    tileXYToNativeRectangle(x: number, y: number, level: number, result: any) {
        const tileWidth: number = this.resolutions[level];
        const west: number = x * tileWidth;
        const east: number = (x + 1) * tileWidth;
        const north: number = ((y = -y) + 1) * tileWidth;
        const south: number = y * tileWidth;

        if (!defined(result)) {
            return new Rectangle(west, south, east, north);
        }

        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    }

    /**
     *
     * @param position
     * @param level
     * @param result
     * @returns {undefined|*}
     */
    positionToTileXY(position: any, level: number, result: any) {
        const rectangle: any = this.rectangle;
        if (!Rectangle.contains(rectangle, position)) {
            return undefined;
        }
        const projection: any = this.projection;
        const webMercatorPosition: Record<string, any> = projection.project(position);
        if (!defined(webMercatorPosition)) {
            return undefined;
        }
        const tileWidth: number = this.resolutions[level];
        const xTileCoordinate: number = Math.floor(webMercatorPosition.x / tileWidth);
        const yTileCoordinate: number = -Math.floor(webMercatorPosition.y / tileWidth);
        if (!defined(result)) {
            return new Cartesian2(xTileCoordinate, yTileCoordinate);
        }
        result.x = xTileCoordinate;
        result.y = yTileCoordinate;
        return result;
    }
}

export default BaiduMercatorTilingScheme;
