import { Component, OnInit } from '@angular/core';
import {
    DatasetApiInterface,
    InternalIdHandler,
    LocatedProfileDataEntry,
    PresenterHighlight,
    TimedDatasetOptions,
    Timespan,
} from '@helgoland/core';

import { ProfilesCombiViewPermalink } from './combi-view-permalink.service';
import { ProfilesCombiService } from './combi-view.service';

@Component({
    selector: 'n52-combi-view',
    templateUrl: './combi-view.component.html',
    styleUrls: ['./combi-view.component.scss']
})
export class ProfilesCombiViewComponent implements OnInit {

    public datasetIds: Array<string>;

    public datasetOptions: Map<string, Array<TimedDatasetOptions>>;

    public datasetLabel: string;

    public geometry: GeoJSON.LineString;

    public highlightGeometry: GeoJSON.Point;

    constructor(
        private service: ProfilesCombiService,
        private api: DatasetApiInterface,
        private internalIdHandler: InternalIdHandler,
        private permalinkSrvc: ProfilesCombiViewPermalink
    ) {
        this.permalinkSrvc.validatePeramlink();
    }

    ngOnInit() {
        this.datasetIds = this.service.datasetIds;
        this.datasetOptions = this.service.datasetOptions;
        if (this.datasetIds.length === 1) {
            this.loadDataset(this.datasetIds[0]);
        }
    }

    private loadDataset(internalId: string) {
        const combination = this.internalIdHandler.resolveInternalId(internalId);
        this.api.getDataset(combination.id, combination.url).subscribe(ds => {
            this.datasetLabel = ds.label;
            const timestamp = this.datasetOptions.get(internalId)[0].timestamp;
            const timespan = new Timespan(timestamp, timestamp);
            this.api.getData<LocatedProfileDataEntry>(combination.id, combination.url, timespan).subscribe(data => {
                this.geometry = data.values[0].geometry as GeoJSON.LineString;
            });
        });
    }

    public onChartHighlight(highlight: PresenterHighlight) {
        this.highlightGeometry = {
            type: 'Point',
            coordinates: this.geometry.coordinates[highlight.dataIndex]
        };
    }

}
