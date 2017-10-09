import 'leaflet.markercluster';

import { AfterViewInit, ChangeDetectorRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

import { ParameterFilter } from './../../../model/api/parameterFilter';
import { MapCache } from './../../../services/map/map.service';

export abstract class MapSelectorComponent<T> implements OnChanges, AfterViewInit {

    @Input()
    public mapId: string;

    @Input()
    public serviceUrl: string;

    @Input()
    public filter: ParameterFilter;

    @Input()
    public mapLayers: any; // TODO implement input mapLayers

    @Input()
    public cluster: boolean; // TODO implement clustering

    @Output()
    public onSelected: EventEmitter<T> = new EventEmitter<T>();

    public loading: boolean;
    public noResultsFound: boolean;
    protected map: L.Map;

    protected icon = L.icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    constructor(
        protected mapCache: MapCache,
        protected cd: ChangeDetectorRef
    ) { }

    public ngAfterViewInit() {
        this.map = L.map(this.mapId, {});
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        this.mapCache.setMap(this.mapId, this.map);
        setTimeout(() => {
            this.drawGeometries();
            this.cd.detectChanges();
        }, 10);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if ((changes.serviceUrl || changes.filter) && this.map) {
            this.drawGeometries();
        }
    }

    protected abstract drawGeometries(): void;
}
