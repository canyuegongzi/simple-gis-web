import { ImageryProvider, Cartesian2, WebMercatorTilingScheme, DeveloperError } from 'cesium';
import BaiduMercatorTilingScheme from './BaiduMercatorTilingScheme';

const IMG_URL: string = 'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46';

const VEC_URL: string = 'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020';

const CUSTOM_URL: string = 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid={style}';

class BaiduImageryProvider {

    public _tileWidth: number;

    public _tileHeight: number;

    public _maximumLevel: number;

    public _rectangle: any;

    public _credit: any;

    public _crs: any;

    public _style: any;

    public _tilingScheme: any;

    public _url: any;

    public _token: any;

    constructor(options: any = {}) {
        this._url =
            options.style === 'img'
                ? IMG_URL
                : options.style === 'vec'
                    ? VEC_URL
                    : CUSTOM_URL;
        this._tileWidth = 256;
        this._tileHeight = 256;
        this._maximumLevel = 18;
        this._crs = options.crs || 'BD09';
        if (options.crs === 'WGS84') {
            let resolutions: number[] = [];
            for (let i = 0; i < 19; i++) {
                resolutions[i] = 256 * Math.pow(2, 18 - i);
            }
            this._tilingScheme = new BaiduMercatorTilingScheme({
                resolutions,
                rectangleSouthwestInMeters: new Cartesian2(
                    -20037726.37,
                    -12474104.17
                ),
                rectangleNortheastInMeters: new Cartesian2(
                    20037726.37,
                    12474104.17
                )
            });
        } else {
            this._tilingScheme = new WebMercatorTilingScheme({
                rectangleSouthwestInMeters: new Cartesian2(-33554054, -33746824),
                rectangleNortheastInMeters: new Cartesian2(33554054, 33746824)
            });
        }
        this._rectangle = this._tilingScheme.rectangle;
        this._credit = undefined;
        this._style = options.style || 'normal';
    }

    get url() {
        return this._url;
    }

    get token() {
        return this._token;
    }

    get tileWidth() {
        if (!this.ready) {
            throw new DeveloperError(
                'tileWidth must not be called before the imagery provider is ready.'
            );
        }
        return this._tileWidth;
    }

    get tileHeight() {
        if (!this.ready) {
            throw new DeveloperError(
                'tileHeight must not be called before the imagery provider is ready.'
            );
        }
        return this._tileHeight;
    }

    get maximumLevel() {
        if (!this.ready) {
            throw new DeveloperError(
                'maximumLevel must not be called before the imagery provider is ready.'
            );
        }
        return this._maximumLevel;
    }

    get minimumLevel() {
        if (!this.ready) {
            throw new DeveloperError(
                'minimumLevel must not be called before the imagery provider is ready.'
            );
        }
        return 0;
    }

    get tilingScheme() {
        if (!this.ready) {
            throw new DeveloperError(
                'tilingScheme must not be called before the imagery provider is ready.'
            );
        }
        return this._tilingScheme;
    }

    get rectangle() {
        if (!this.ready) {
            throw new DeveloperError(
                'rectangle must not be called before the imagery provider is ready.'
            );
        }
        return this._rectangle;
    }

    get ready() {
        return !!this._url;
    }

    get credit() {
        return this._credit;
    }

    get hasAlphaChannel() {
        return true;
    }

    getTileCredits(x: number, y: number, level: number) {}

    requestImage(x: number, y: number, level: number) {
        if (!this.ready) {
            throw new DeveloperError(
                'requestImage must not be called before the imagery provider is ready.'
            );
        }
        let xTiles: any = this._tilingScheme.getNumberOfXTilesAtLevel(level);
        let yTiles: any = this._tilingScheme.getNumberOfYTilesAtLevel(level);
        let url: string = this._url
            .replace('{z}', level)
            .replace('{s}', String(1))
            .replace('{style}', this._style);
        if (this._crs === 'WGS84') {
            url = url.replace('{x}', String(x)).replace('{y}', String(-y));
        } else {
            url = url
                .replace('{x}', String(x - xTiles / 2))
                .replace('{y}', String(yTiles / 2 - y - 1));
        }
        // @ts-ignore
        return ImageryProvider.loadImage(this, url);
    }
}

export default BaiduImageryProvider;
