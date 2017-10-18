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
import { ApiInterface, IDataset, LocatedProfileDataEntry, MapCache, Timespan } from 'helgoland-toolbox';
import * as L from 'leaflet';

import { MapSelectorComponent } from './map-selector.component';

@Component({
    selector: 'n52-profile-trajectory-map-selector',
    templateUrl: './map-selector.component.html',
    styleUrls: ['./map-selector.component.scss']
})
export class ProfileTrajectoryMapSelectorComponent extends MapSelectorComponent<TrajectoryResult> implements OnChanges, AfterViewInit {

    @Input()
    public selectedTimespan: Timespan;

    @Output()
    public onTimeListDetermined: EventEmitter<Array<number>> = new EventEmitter();

    private layer: L.FeatureGroup;
    private data: Array<LocatedProfileDataEntry>;
    private dataset: IDataset;

    private defaultStyle: L.PathOptions = {
        color: 'red',
        weight: 5,
        opacity: 0.65
    };

    private highlightStyle: L.PathOptions = {
        color: 'blue',
        weight: 7,
        opacity: 1
    };

    constructor(
        private apiInterface: ApiInterface,
        protected mapCache: MapCache,
        protected cd: ChangeDetectorRef
    ) {
        super(mapCache, cd);
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (changes.selectedTimespan && this.selectedTimespan) {
            this.clearMap();
            this.initLayer();
            this.data.forEach(entry => {
                if (this.selectedTimespan.from <= entry.timestamp && entry.timestamp <= this.selectedTimespan.to) {
                    this.layer.addLayer(this.createGeoJson(entry, this.dataset));
                }
            });
            this.layer.addTo(this.map);
        }
    }

    protected drawGeometries() {
        this.noResultsFound = false;
        this.loading = true;
        this.apiInterface.getDatasets(this.serviceUrl, this.filter).subscribe(datasets => {
            datasets.forEach(dataset => {
                this.dataset = dataset;
                const timespan = new Timespan(dataset.firstValue.timestamp, dataset.lastValue.timestamp);
                this.apiInterface.getData<LocatedProfileDataEntry>(dataset.id, this.serviceUrl, timespan).subscribe(data => {
                    if (data.values instanceof Array) {
                        this.initLayer();
                        this.data = [];
                        const timelist: Array<number> = [];
                        data.values.forEach(entry => {
                            this.data.push(entry);
                            const geojson = this.createGeoJson(entry, dataset);
                            timelist.push(entry.timestamp);
                            this.layer.addLayer(geojson);
                        });
                        this.onTimeListDetermined.emit(timelist);
                        this.layer.addTo(this.map);
                        this.map.fitBounds(this.layer.getBounds());
                    }
                    this.loading = false;
                });
            });
        });
    }

    private initLayer() {
        this.layer = L.markerClusterGroup({ animate: false });
    }

    private clearMap() {
        if (this.layer) {
            this.map.removeLayer(this.layer);
        }
    }

    private createGeoJson(profileDataEntry: LocatedProfileDataEntry, dataset: IDataset): L.GeoJSON {
        const geojson = new L.GeoJSON(profileDataEntry.geometry);
        geojson.setStyle(() => this.defaultStyle);
        geojson.on('click', () => {
            this.onSelected.emit({
                dataset: dataset,
                data: profileDataEntry
            });
        });
        geojson.on('mouseover', () => {
            geojson.setStyle(() => this.highlightStyle);
            geojson.bringToFront();
        });
        geojson.on('mouseout', () => {
            geojson.setStyle(() => this.defaultStyle);
        });
        return geojson;
    }
}

export interface TrajectoryResult {
    dataset: IDataset;
    data: LocatedProfileDataEntry;
}
