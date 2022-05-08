import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Marker } from 'leaflet';


class LeafletMarkerCluster {
    public L: any;

    constructor(L: any) {
        this.L = L;
    }

    /**
     * 创建聚合
     * @param markers
     */
    public createClusterMarker(markers: Marker[]) {
        const createMakerCluster = this.L.markerClusterGroup();
        console.log(createMakerCluster);
        for (let i = 0; i < markers.length; i++) {
            createMakerCluster.addLayer(markers[i]);
        }
        return createMakerCluster;
    }
}

export default LeafletMarkerCluster;
