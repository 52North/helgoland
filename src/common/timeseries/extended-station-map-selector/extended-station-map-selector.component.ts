import 'leaflet.markercluster';

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    KeyValueDiffers,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import {
    DatasetApiInterface,
    HasLoadableContent,
    Mixin,
    ParameterFilter,
    Station,
    StatusIntervalResolverService,
    Timeseries,
    TimeseriesExtras,
} from '@helgoland/core';
import {
    StationMapSelectorComponent,
    MapCache,
    MapSelectorComponent
} from '@helgoland/map';


import GeoJSON from 'geojson';
import * as L from 'leaflet';

// import { MapCache } from '../../base/map-cache.service';
// import { MapSelectorComponent } from '../map-selector.component';
import { Layer } from 'leaflet';
import { forkJoin, Observable } from 'rxjs';

@Component({
    selector: 'n52-extended-station-map-selector',
    templateUrl: './extended-station-map-selector.component.html',
    styleUrls: ['./extended-station-map-selector.component.scss']
})
@Mixin([HasLoadableContent])
export class ExtendedStationMapSelectorComponent extends MapSelectorComponent<Station> implements OnChanges, AfterViewInit {

    @Input()
    public serviceUrl: string;

    @Input()
    public cluster: boolean;

    @Input()
    public statusIntervals: boolean;

    /**
     * Ignores all Statusintervals where the timestamp is before a given duration in milliseconds and draws instead the default marker.
     */
    @Input()
    public ignoreStatusIntervalIfBeforeDuration = Infinity;

    private markerGroup: L.FeatureGroup;

    constructor(
        protected statusIntervalResolver: StatusIntervalResolverService,
        protected apiInterface: DatasetApiInterface,
        protected mapCache: MapCache,
        protected differs: KeyValueDiffers,
        protected cd: ChangeDetectorRef
    ) {
        super(mapCache, differs, cd);
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (this.map && changes.statusIntervals) { this.drawGeometries(); }
    }

    protected drawGeometries() {
        this.isContentLoading(true);
        if (this.map && this.markerGroup) { this.map.removeLayer(this.markerGroup); }
        if (this.statusIntervals && this.filter && this.filter.phenomenon) {
            this.createExtendedValuedMarkers();
        } else {
            this.createExtendedStationGeometries();
        }
    }

    private createExtendedValuedMarkers() {
        const tempFilter: ParameterFilter = {
            phenomenon: this.filter.phenomenon,
            expanded: true
        };
        this.apiInterface.getTimeseries(this.serviceUrl, tempFilter).subscribe((timeseries: Timeseries[]) => {
            this.markerGroup = L.featureGroup();
            const obsList: Array<Observable<TimeseriesExtras>> = [];
            timeseries.forEach((ts: Timeseries) => {
                const obs = this.apiInterface.getTimeseriesExtras(ts.id, this.serviceUrl);
                obsList.push(obs);
                obs.subscribe((extras: TimeseriesExtras) => {
                    let marker;
                    if (extras.statusIntervals) {
                        if ((ts.lastValue.timestamp) > new Date().getTime() - this.ignoreStatusIntervalIfBeforeDuration) {
                            const interval = this.statusIntervalResolver.getMatchingInterval(ts.lastValue.value, extras.statusIntervals);
                            if (interval) { marker = this.createExtendedColoredMarker(ts.station, interval.color); }
                        }
                    }
                    if (!marker) { marker = this.createExtendedDefaultColoredMarker(ts.station); }
                    marker.on('click', () => {
                        this.onSelected.emit(ts.station);
                    });
                    this.markerGroup.addLayer(marker);
                });
            });

            forkJoin(obsList).subscribe(() => {
                this.zoomToMarkerBounds(this.markerGroup.getBounds());
                if (this.map) { this.map.invalidateSize(); }
                this.isContentLoading(false);
            });

            if (this.map) { this.markerGroup.addTo(this.map); }
        });
    }

    private createExtendedColoredMarker(station: Station, color: string): Layer {
        if (this.markerSelectorGenerator.createFilledMarker) {
            return this.markerSelectorGenerator.createFilledMarker(station, color);
        }
        return this.createFilledMarker(station, color, 10);
    }

    private createExtendedDefaultColoredMarker(station: Station): Layer {
        if (this.markerSelectorGenerator.createDefaultFilledMarker) {
            return this.markerSelectorGenerator.createDefaultFilledMarker(station);
        }
        return this.createFilledMarker(station, '#000', 10);
    }

    private createFilledMarker(station: Station, color: string, radius: number): Layer {
        let geometry: Layer;
        if (station.geometry.type === 'Point') {
            const point = station.geometry as GeoJSON.Point;
            geometry = L.circleMarker([point.coordinates[1], point.coordinates[0]], {
                color: '#000',
                fillColor: color,
                fillOpacity: 0.8,
                radius: 10,
                weight: 2,

            });
        } else {
            geometry = L.geoJSON(station.geometry, {
                style: (feature) => {
                    return {
                        color: '#000',
                        fillColor: color,
                        fillOpacity: 0.8,
                        weight: 2,
                    };
                },
                onEachFeature: function (feature, layer) {
                    layer.bindTooltip(station.properties.label);
                }
            });
        }
        if (geometry) {
            geometry.on('click', () => {
                this.onSelected.emit(station);
            });
            return geometry;
        }
    }


    private createExtendedStationGeometries() {
        this.apiInterface.getStations(this.serviceUrl, this.filter)
            .subscribe((res) => {
                if (this.cluster) {
                    this.markerGroup = L.markerClusterGroup({ animate: true });
                } else {
                    this.markerGroup = L.featureGroup();
                }
                if (res instanceof Array && res.length > 0) {
                    res.forEach((entry) => {
                        const marker = this.createExtendedDefaultGeometry(entry);
                        if (marker) { this.markerGroup.addLayer(marker); }
                    });
                    this.markerGroup.addTo(this.map);
                    this.zoomToMarkerBounds(this.markerGroup.getBounds());
                } else {
                    this.onNoResultsFound.emit(true);
                }
                this.map.invalidateSize();
                this.isContentLoading(false);
            });
    }

    private createExtendedDefaultGeometry(station: Station): Layer {
        if (this.markerSelectorGenerator && this.markerSelectorGenerator.createDefaultGeometry) {
            return this.markerSelectorGenerator.createDefaultGeometry(station);
        }
        if (station.geometry) {
            const geometry = L.geoJSON(station.geometry, {
                onEachFeature: function (feature, layer) {
                    layer.bindTooltip(station.properties.label);
                }
            });

            geometry
                .on('click', () => this.onSelected.emit(station));
            return geometry;
            return geometry;
        } else {
            console.error(station.id + ' has no geometry');
        }
    }
}
