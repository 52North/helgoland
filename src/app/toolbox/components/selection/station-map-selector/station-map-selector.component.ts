import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';

import { Station } from './../../../model/api/station';
import { ApiInterface } from './../../../services/api-interface/api-interface.service';
import { MapCache } from './../../../services/map/map.service';

@Component({
    selector: 'n52-station-map-selector',
    templateUrl: './station-map-selector.component.html',
    styleUrls: ['./station-map-selector.component.scss']
})
export class StationMapSelectorComponent implements OnChanges, AfterViewInit {

    @Input()
    public mapId: string;

    @Input()
    public serviceUrl: string;

    @Input()
    public filter: any;

    @Input()
    public mapLayers: any;

    @Input()
    public cluster: any;

    @Output()
    public onStationSelected: EventEmitter<Station> = new EventEmitter<Station>();

    public loading: boolean;
    public noResultsFound: boolean;
    private map;
    private layer;

    private icon = L.icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    constructor(
        private apiInterface: ApiInterface,
        private mapCache: MapCache,
        private cd: ChangeDetectorRef
    ) { }

    public ngAfterViewInit() {
        this.map = L.map(this.mapId, {});
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        this.mapCache.setMap(this.mapId, this.map);
        this.drawMarker();
        this.cd.detectChanges();
    }

    public ngOnChanges(changes: SimpleChanges): any {
        if (this.map) {
            this.drawMarker();
        }
    }

    public drawMarker() {
        this.noResultsFound = false;
        this.loading = true;
        if (this.layer) { this.map.removeLayer(this.layer); }
        this.apiInterface.getStations(this.serviceUrl, this.filter)
            .subscribe((res) => {
                this.layer = L.markerClusterGroup({
                    animate: true
                });
                if (res instanceof Array && res.length > 0) {
                    res.forEach((entry) => {
                        const marker = L.marker([entry.geometry.coordinates[1], entry.geometry.coordinates[0]], {
                            icon: this.icon
                        });
                        marker.on('click', () => {
                            this.onStationSelected.emit(entry);
                        });
                        this.layer.addLayer(marker);
                    });
                    this.layer.addTo(this.map);
                    this.map.fitBounds(this.layer.getBounds());
                } else {
                    this.noResultsFound = true;
                }
                this.map.invalidateSize();
                this.loading = false;
            });
    }
}
