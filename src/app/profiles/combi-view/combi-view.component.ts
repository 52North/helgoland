import { Component, OnInit } from '@angular/core';

import { LocatedProfileDataEntry } from '../../toolbox/model/api/data';
import { GraphHighlight } from './../../toolbox/components/graph/datasetGraphComponent';
import { TimedDatasetOptions } from './../../toolbox/model/api/dataset/options';
import { Timespan } from './../../toolbox/model/internal/time-interval';
import { ApiInterface } from './../../toolbox/services/api-interface/api-interface.service';
import { InternalIdHandler } from './../../toolbox/services/api-interface/internal-id-handler.service';
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
        private api: ApiInterface,
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
            const timespan = new Timespan(new Date(timestamp), new Date(timestamp));
            this.api.getData<LocatedProfileDataEntry>(combination.id, combination.url, timespan).subscribe(data => {
                this.geometry = data.values[0].geometry as GeoJSON.LineString;
            });
        });
    }

    public onChartHighlight(highlight: GraphHighlight) {
        this.highlightGeometry = {
            type: 'Point',
            coordinates: this.geometry.coordinates[highlight.dataIndex]
        };
    }

}
