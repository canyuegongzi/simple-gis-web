/// <reference types="vite/client" />

import {BaseService as CesiumBaseService} from "./map/service/cesium";
import {BaseService as LeftBaseService} from "./map/service/leaflet";
import {BaseService as MapboxBaseService} from "./map/service/mapbox";
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare global {
  interface Window {
    cesiumMapService: CesiumBaseService;
    leafletMapService: LeftBaseService;
    mapboxMapService: MapboxBaseService
  }
}
window.cesiumMapService= Window.cesiumMapService|| {};
window.leafletMapService= Window.leafletMapService|| {};
window.mapboxMapService= Window.mapboxMapService|| {};
