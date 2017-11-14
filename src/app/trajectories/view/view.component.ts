import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import {
    ApiInterface,
    D3AxisType,
    D3GraphOptions,
    D3SelectionRange,
    DatasetOptions,
    IDataset,
    InternalIdHandler,
    LocatedTimeValueEntry,
    Timespan,
} from 'helgoland-toolbox';

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

    public highlightGeometry: GeoJSON.DirectGeometryObject;

    public zoomToGeometry: GeoJSON.DirectGeometryObject;

    public timespan: Timespan;

    public datasetIds: Array<string>;

    public trajectory: IDataset;

    public loading: boolean;

    public geometry: GeoJSON.LineString;

    public options: Map<string, DatasetOptions>;

    public editableOption: DatasetOptions;

    public tempColor: string;

    @ViewChild('modalTrajectoryOptionsEditor')
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
        private permalinkSrvc: TrajectoriesViewPermalink,
        private api: ApiInterface,
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
            this.api.getDataset(internalId.id, internalId.url).subscribe(dataset => {
                this.trajectory = dataset;
                this.timespan = new Timespan(dataset.firstValue.timestamp, dataset.lastValue.timestamp);
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

    public onChartSelectionChanged(range: D3SelectionRange) {
        this.highlightGeometry = {
            type: 'LineString',
            coordinates: this.geometry.coordinates.slice(range.from, range.to)
        };
    }

    public onChartSelectionChangedFinished(range: D3SelectionRange) {
        console.log('Range finished: ' + range.from + ' ' + range.to);
        this.selection = range;
        this.zoomToGeometry = {
            type: 'LineString',
            coordinates: this.geometry.coordinates.slice(range.from, range.to)
        };
    }

    public onChartHighlightChanged(idx: number) {
        this.highlightGeometry = {
            type: 'Point',
            coordinates: this.geometry.coordinates[idx]
        };
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

}
