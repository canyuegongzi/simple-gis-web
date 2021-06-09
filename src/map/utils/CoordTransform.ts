/**
 * 坐标转换
 */
const BD_FACTOR = (3.14159265358979324 * 3000.0) / 180.0;
const PI = 3.1415926535897932384626;
const RADIUS = 6378245.0;
const EE = 0.00669342162296594323;

class CoordTransform {
    /**
     * BD-09 To GCJ-02
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static BD09ToGCJ02(lng: number, lat: number): number[] {
        let x: number = +lng - 0.0065;
        let y: number = +lat - 0.006;
        let z: number = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * BD_FACTOR);
        let theta: number = Math.atan2(y, x) - 0.000003 * Math.cos(x * BD_FACTOR);
        let gg_lng: number = z * Math.cos(theta);
        let gg_lat: number = z * Math.sin(theta);
        return [gg_lng, gg_lat];
    }

    /**
     * GCJ-02 To BD-09
     * @param lng
     * @param lat
     * @returns {number[]}
     * @constructor
     */
    static GCJ02ToBD09(lng: number, lat: number): number[] {
        lat = +lat;
        lng = +lng;
        let z =
            Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * BD_FACTOR);
        let theta: number = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * BD_FACTOR);
        let bd_lng: number = z * Math.cos(theta) + 0.0065;
        let bd_lat: number = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat];
    }

    /**
     * WGS-84 To GCJ-02
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static WGS84ToGCJ02(lng: number, lat: number): number[] {
        lat = +lat;
        lng = +lng;
        if (this.out_of_china(lng, lat)) {
            return [lng, lat];
        } else {
            let d = this.delta(lng, lat);
            return [lng + d[0], lat + d[1]];
        }
    }

    /**
     * GCJ-02 To WGS-84
     * @param lng
     * @param lat
     * @returns {number[]}
     * @constructor
     */
    static GCJ02ToWGS84(lng: number, lat: number): number[] {
        lat = +lat;
        lng = +lng;
        if (this.out_of_china(lng, lat)) {
            return [lng, lat];
        } else {
            let d: number[] = this.delta(lng, lat);
            let mgLng = lng + d[0];
            let mgLat = lat + d[1];
            return [lng * 2 - mgLng, lat * 2 - mgLat];
        }
    }

    /**
     *
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static delta(lng: number, lat: number): number[] {
        let dLng: number = this.transformLng(lng - 105, lat - 35);
        let dLat: number = this.transformLat(lng - 105, lat - 35);
        const radLat: number = (lat / 180) * PI;
        let magic: number = Math.sin(radLat);
        magic = 1 - EE * magic * magic;
        const sqrtMagic: number = Math.sqrt(magic);
        dLng = (dLng * 180) / ((RADIUS / sqrtMagic) * Math.cos(radLat) * PI);
        dLat = (dLat * 180) / (((RADIUS * (1 - EE)) / (magic * sqrtMagic)) * PI);
        return [dLng, dLat];
    }

    /**
     *
     * @param lng
     * @param lat
     * @returns {number}
     */
    static transformLng(lng: number, lat: number): number {
        lat = +lat;
        lng = +lng;
        let ret =
            300.0 +
            lng +
            2.0 * lat +
            0.1 * lng * lng +
            0.1 * lng * lat +
            0.1 * Math.sqrt(Math.abs(lng));
        ret +=
            ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
                2.0) /
            3.0;
        ret +=
            ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
            3.0;
        ret +=
            ((150.0 * Math.sin((lng / 12.0) * PI) +
                300.0 * Math.sin((lng / 30.0) * PI)) *
                2.0) /
            3.0;
        return ret;
    }

    /**
     *
     * @param lng
     * @param lat
     * @returns {number}
     */
    static transformLat(lng: number, lat: number): number {
        lat = +lat;
        lng = +lng;
        let ret =
            -100.0 +
            2.0 * lng +
            3.0 * lat +
            0.2 * lat * lat +
            0.1 * lng * lat +
            0.2 * Math.sqrt(Math.abs(lng));
        ret +=
            ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
                2.0) /
            3.0;
        ret +=
            ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
            3.0;
        ret +=
            ((160.0 * Math.sin((lat / 12.0) * PI) +
                320 * Math.sin((lat * PI) / 30.0)) *
                2.0) /
            3.0;
        return ret;
    }

    /**
     *
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    static out_of_china(lng: number, lat: number): boolean {
        lat = +lat;
        lng = +lng;
        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
    }
}

export default CoordTransform;
