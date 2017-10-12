import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { AxisType, D3GraphOptions } from '../../toolbox/components/graph/d3-timeseries-graph/d3-timeseries-graph.component';
import { LocatedTimeValueEntry } from '../../toolbox/model/api/data';
import { ApiInterface } from '../../toolbox/services/api-interface/api-interface.service';
import { InternalIdHandler } from '../../toolbox/services/api-interface/internal-id-handler.service';
import { SelectionRange } from './../../toolbox/components/graph/d3-timeseries-graph/d3-timeseries-graph.component';
import { IDataset } from './../../toolbox/model/api/dataset/idataset';
import { DatasetOptions } from './../../toolbox/model/api/dataset/options';
import { Timespan } from './../../toolbox/model/internal/time-interval';
import { TrajectoriesService } from './../services/trajectories.service';
import { TrajectoriesViewPermalink } from './view-permalink';

@Component({
    selector: 'n52-trajectories-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TrajectoriesViewComponent implements OnInit {

    public selection: SelectionRange;

    public highlight: number;

    public highlightGeometry: GeoJSON.DirectGeometryObject;

    public zoomToGeometry: GeoJSON.DirectGeometryObject;

    public timespan: Timespan;

    public datasetIds: Array<string>;

    public trajectory: IDataset;

    public loading: boolean;

    public geometry: GeoJSON.LineString;

    public options: Map<string, DatasetOptions>;

    public graphOptions: D3GraphOptions = {
        axisType: AxisType.Distance,
        dotted: false
    };

    public axisTypeDistance = AxisType.Distance;
    public axisTypeTime = AxisType.Time;
    public axisTypeTicks = AxisType.Ticks;

    constructor(
        private trajectorySrvc: TrajectoriesService,
        private permalinkSrvc: TrajectoriesViewPermalink,
        private api: ApiInterface,
        private internalIdHandler: InternalIdHandler
    ) { }

    public ngOnInit() {
        this.permalinkSrvc.validatePeramlink();
        this.datasetIds = this.trajectorySrvc.datasetIds;
        this.options = this.trajectorySrvc.datasetOptions;
        if (this.trajectorySrvc.hasDatasets()) {
            this.loading = true;
            const internalId = this.internalIdHandler.resolveInternalId(this.datasetIds[0]);
            this.api.getDataset(internalId.id, internalId.url).subscribe(dataset => {
                this.trajectory = dataset;
                this.timespan = new Timespan(new Date(dataset.firstValue.timestamp), new Date(dataset.lastValue.timestamp));
                this.api.getData<LocatedTimeValueEntry>(internalId.id, internalId.url, this.timespan)
                    .subscribe(data => {
                        this.geometry = {
                            type: 'LineString',
                            coordinates: []
                        };
                        data.values.forEach(entry => this.geometry.coordinates.push(entry.geometry.coordinates));
                        this.loading = false;
                    });
            });
        }
    }

    public onChartSelectionChanged(range: SelectionRange) {
        this.highlightGeometry = {
            type: 'LineString',
            coordinates: this.geometry.coordinates.slice(range.from, range.to)
        };
    }

    public onChartSelectionChangedFinished(range: SelectionRange) {
        console.log('Range finished: ' + range.from + ' ' + range.to);
        this.selection = range;
        this.zoomToGeometry = {
            type: 'LineString',
            coordinates: this.geometry.coordinates.slice(range.from, range.to)
        };
    }

    public onChartHighlightChanged(idx: number) {
        this.highlight = idx;
        this.highlightGeometry = {
            type: 'Point',
            coordinates: this.geometry.coordinates[idx]
        };
    }

    public onAxisTypeChanged(axisType: AxisType) {
        this.graphOptions.axisType = axisType;
    }

    public onDottedChanged(dotted: boolean) {
        this.graphOptions.dotted = dotted;
    }

    public onAddDataset(entry: DatasetOptions) {
        this.trajectorySrvc.addDataset(entry.internalId, new DatasetOptions(entry.internalId, entry.color));
    }

    public onRemoveDataset(internalId: string) {
        this.trajectorySrvc.removeDataset(internalId);
    }

}
