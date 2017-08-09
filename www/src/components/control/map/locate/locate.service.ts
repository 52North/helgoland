import { Injectable } from '@angular/core';
import { MapCache } from '../../../../services/map';
import * as L from 'leaflet';

const LOCATION_FOUND_EVENT = 'locationfound';
const LOCATED_MARKER_ID = 'located';

const icon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

@Injectable()
export class LocateService {

    constructor(
        private mapCache: MapCache
    ) { }

    public startLocate(id: string) {
        const map = this.mapCache.getMap(id);
        map.on(LOCATION_FOUND_EVENT, (evt) => {
            this.removeMarker(map);
            const marker = L.marker(evt.latlng, {
                icon
            }).addTo(map);
            marker['id'] = LOCATED_MARKER_ID;
        });
        map.locate({
            watch: true,
            setView: true
        });
    }

    public stopLocate(id: string) {
        const map = this.mapCache.getMap(id);
        map.stopLocate();
        map.off(LOCATION_FOUND_EVENT);
        this.removeMarker(map);
    }

    private removeMarker(map: any) {
        let layer;
        map.eachLayer((entry) => {
            if (entry.id === LOCATED_MARKER_ID) {
                layer = entry;
            }
        });
        if (layer) map.removeLayer(layer);
    }

}
