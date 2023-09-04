import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    DatasetOptions,
    DatasetType,
    HelgolandServicesConnector,
    HelgolandTrajectory,
    InternalIdHandler,
    LocatedTimeValueEntry,
    Timespan,
} from '@helgoland/core';
import { D3AxisType, D3GraphOptions, D3SelectionRange } from '@helgoland/d3';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TrajectoriesService } from './../services/trajectories.service';
import { TrajectoriesViewPermalink } from './view-permalink';

@Component({
    selector: 'n52-trajectories-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TrajectoriesViewComponent implements OnInit {

    public selection: D3SelectionRange;

    public highlightGeometry: GeoJSON.GeoJsonObject;

    public zoomToGeometry: GeoJSON.LineString;

    public timespan: Timespan;

    public datasetIds: Array<string>;

    public trajectory: HelgolandTrajectory;

    public loading: boolean;

    public geometry: GeoJSON.LineString;

    public options: Map<string, DatasetOptions>;

    public editableOption: DatasetOptions;

    public tempColor: string;

    public graphData: LocatedTimeValueEntry[];

    public selectedTimespan: Timespan;

    @ViewChild('modalTrajectoryOptionsEditor', { static: true })
    public modalTrajectoryOptionsEditor: TemplateRef<any>;

    public graphOptions: D3GraphOptions = {
        axisType: D3AxisType.Distance,
        dotted: false
    };

    public axisTypeDistance = D3AxisType.Distance;
    public axisTypeTime = D3AxisType.Time;
    public axisTypeTicks = D3AxisType.Ticks;

    constructor(
        private trajectorySrvc: TrajectoriesService,
        public permalinkSrvc: TrajectoriesViewPermalink,
        private servicesConnector: HelgolandServicesConnector,
        private internalIdHandler: InternalIdHandler,
        private modalService: NgbModal
    ) { }

    public ngOnInit() {
        this.permalinkSrvc.validatePeramlink();
        this.datasetIds = this.trajectorySrvc.datasetIds;
        this.options = this.trajectorySrvc.datasetOptions;
        if (this.trajectorySrvc.hasDatasets()) {
            this.loading = true;
            const internalId = this.internalIdHandler.resolveInternalId(this.datasetIds[0]);
            this.servicesConnector.getDataset(internalId, { type: DatasetType.Trajectory }).subscribe(
                trajectory => {
                    this.trajectory = trajectory;
                    this.timespan = new Timespan(trajectory.firstValue.timestamp, trajectory.lastValue.timestamp);
                    this.selectedTimespan = this.timespan;
                    this.servicesConnector.getDatasetData(trajectory, this.timespan).subscribe(
                        data => {
                            this.geometry = {
                                type: 'LineString',
                                coordinates: []
                            };
                            this.graphData = data.values;
                            data.values.forEach(entry => this.geometry.coordinates.push(entry.geometry.coordinates));
                            this.loading = false;
                        }
                    );
                }
            );
        }
    }

    public onChartSelectionChanged(range: D3SelectionRange) {
        this.highlightGeometry = {
            type: 'LineString',
            coordinates: this.geometry.coordinates.slice(range.from, range.to)
        } as GeoJSON.GeoJsonObject;
    }

    public onChartSelectionChangedFinished(range: D3SelectionRange) {
        this.selection = range;
        this.zoomToGeometry = {
            type: 'LineString',
            coordinates: this.geometry.coordinates.slice(range.from, range.to)
        };
        if (this.graphData) {
            const from = this.graphData[this.selection.from].timestamp;
            const to = this.selection.to < this.graphData.length ? this.graphData[this.selection.to].timestamp : this.timespan.to;
            this.selectedTimespan = new Timespan(from, to);
        }
    }

    public onChartHighlightChanged(idx: number) {
        this.highlightGeometry = {
            type: 'Point',
            coordinates: this.geometry.coordinates[idx]
        } as GeoJSON.GeoJsonObject;
    }

    public onAxisTypeChanged(axisType: D3AxisType) {
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

    public editOptions(option: DatasetOptions) {
        this.editableOption = option;
        this.modalService.open(this.modalTrajectoryOptionsEditor);
    }

    public updateOption(option: DatasetOptions) {
        this.editableOption.color = this.tempColor;
        this.trajectorySrvc.updateDatasetOptions(this.editableOption, this.editableOption.internalId);
    }

    public hasVisibleDatasets(): boolean {
        return Array.from(this.options.values()).some(entry => entry.visible);
    }

}
