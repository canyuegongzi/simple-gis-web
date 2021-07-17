import { MapOptions } from 'leaflet';

export interface LeafletInstanceOptions extends MapOptions{
    id: string;
    [key: string]: any
}
