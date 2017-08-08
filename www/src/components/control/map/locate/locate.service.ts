import { Injectable } from '@angular/core';
import { MapCache } from '../../../../services/map';
import * as L from 'leaflet';

const DefaultIcon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

L.Marker.prototype.options.icon = DefaultIcon;

const LOCATION_FOUND_EVENT = 'locationfound';
const LOCATED_MARKER_ID = 'located';

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
                icon: new L.Icon.Default()
            }).addTo(map);
            marker[id] = LOCATED_MARKER_ID;
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
