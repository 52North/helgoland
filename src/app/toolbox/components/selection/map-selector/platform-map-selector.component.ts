import { AfterViewInit, ChangeDetectorRef, Component, OnChanges } from '@angular/core';
import * as L from 'leaflet';

import { Platform } from './../../../model/api/platform';
import { ApiInterface } from './../../../services/api-interface/api-interface.service';
import { MapCache } from './../../../services/map/map.service';
import { MapSelectorComponent } from './map-selector.component';

@Component({
    selector: 'n52-platform-map-selector',
    templateUrl: './map-selector.component.html',
    styleUrls: ['./map-selector.component.scss']
})
export class PlatformMapSelectorComponent extends MapSelectorComponent<Platform> implements OnChanges, AfterViewInit {

    private markerClusterGroup: L.FeatureGroup;

    constructor(
        private apiInterface: ApiInterface,
        protected mapCache: MapCache,
        protected cd: ChangeDetectorRef
    ) {
        super(mapCache, cd);
    }

    protected drawGeometries() {
        this.noResultsFound = false;
        this.loading = true;
        if (this.markerClusterGroup) { this.map.removeLayer(this.markerClusterGroup); }
        this.apiInterface.getPlatforms(this.serviceUrl, this.filter)
            .subscribe((res) => {
                this.markerClusterGroup = L.markerClusterGroup({
                    animate: true
                });
                if (res instanceof Array && res.length > 0) {
                    res.forEach((entry) => {
                        const marker = L.marker([entry.geometry.coordinates[1], entry.geometry.coordinates[0]], {
                            icon: this.icon
                        });
                        marker.on('click', () => {
                            this.onSelected.emit(entry);
                        });
                        this.markerClusterGroup.addLayer(marker);
                    });
                    this.markerClusterGroup.addTo(this.map);
                    this.map.fitBounds(this.markerClusterGroup.getBounds());
                } else {
                    this.noResultsFound = true;
                }
                this.map.invalidateSize();
                this.loading = false;
            });
    }
}
