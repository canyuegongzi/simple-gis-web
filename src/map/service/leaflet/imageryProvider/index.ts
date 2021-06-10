import './TileLayerBaidu';
const baseLayers: Record<string, any> = {
    高德地图: {
        url: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        options: { subdomains: "1234" }
    },
    高德影像: {
        url: [
            {
                url: 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                options: { subdomains: "1234" }
            },
            {
                url: 'http://webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
                options: { subdomains: "1234" }
            }
        ]
    },
    天地图: {
        url: [
            {
                url: 'http://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c',
                options: { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }
            },
            {
                url: 'http://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c',
                options: { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }
            }
        ]
    },
    天地图影像: {
        url: [
            {
                url: 'ttp://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c',
                options: { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }
            },
            {
                url: 'http://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c',
                options: { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }
            }
        ]
    },
    天地图地形: {
        url: [
            {
                url: 'http://t{s}.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c',
                options: { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }
            },
            {
                url: 'http://t{s}.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c',
                options: { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }
            }
        ]
    },
    Google地图: {
        url: 'http://mt1.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile'
    },

    Google影像: {
        url: [
            {
                url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gal',
            },
            {
                url: 'http://mt1.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil',
            }
        ]
    },

    "GeoQ": {
        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}'
    },
    GeoQ藏蓝: {
        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
    },
    GeoQ灰: {
        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}'
    }
};

export { baseLayers };
