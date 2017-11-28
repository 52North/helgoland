import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Data, DatasetOptions, IDataEntry, IDataset, PlotOptions, Service, Time, Timespan } from 'helgoland-toolbox';

import { ModalGeometryViewerComponent } from '../../components/modal-geometry-viewer/modal-geometry-viewer.component';
import { ModalOptionsEditorComponent } from '../../components/modal-options-editor/modal-options-editor.component';
import {
    ModalTimeseriesTimespanComponent,
} from '../../components/modal-timeseries-timespan/modal-timeseries-timespan.component';
import { TimeseriesService } from './../services/timeseries.service';
import { TimeseriesDiagramPermalink } from './diagram-permalink.service';

@Component({
    selector: 'n52-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.scss']
})
export class TimeseriesDiagramComponent implements OnInit {

    public timeseries: Array<IDataset>;
    public datasetIds: Array<string>;
    public datasetOptions: Map<string, DatasetOptions>;
    public selectedIds: Array<string> = new Array();
    public highlightId: string;
    public data: Array<Data<IDataEntry>>;
    public timespan: Timespan;
    public selectedProvider: Service;

    public diagramOptions: PlotOptions = {
        pan: {
            frameRate: 10,
            interactive: true
        },
        showReferenceValues: true,
        touch: {
            delayTouchEnded: 200,
            pan: 'x',
            scale: ''
        },
        yaxis: {
            additionalWidth: 17,
            labelWidth: 50,
            min: null,
            panRange: false,
            show: true
        }
    };

    public overviewOptions: PlotOptions = {
        selection: {
            mode: 'overview',
            color: '#718296',
            shape: 'butt',
            minSize: 30
        },
        grid: {
            hoverable: false,
            autoHighlight: false
        },
        yaxis: {
            show: false
        },
        touch: {
            pan: '',
            scale: ''
        },
        generalizeAllways: true
    };

    public overviewLoading: boolean;

    constructor(
        private timeseriesService: TimeseriesService,
        private timeSrvc: Time,
        private permalinkSrvc: TimeseriesDiagramPermalink,
        private modalService: NgbModal,
        private cdr: ChangeDetectorRef
    ) { }

    public ngOnInit() {
        this.permalinkSrvc.validatePeramlink();
        this.datasetIds = this.timeseriesService.datasetIds;
        this.datasetOptions = this.timeseriesService.datasetOptions;
        this.timespan = this.timeseriesService.timespan;
    }

    public deleteTimeseries(internalId: string) {
        this.timeseriesService.removeDataset(internalId);
    }

    public selectTimeseries(selected: boolean, internalId: string) {
        if (selected) {
            this.selectedIds.push(internalId);
        } else {
            this.selectedIds.splice(this.selectedIds.findIndex(entry => entry === internalId), 1);
        }
    }

    public timeseriesSelected(selections: Array<string>) {
        this.selectedIds = selections;
    }

    public isSelected(internalId: string) {
        return this.selectedIds.find(e => e === internalId);
    }

    public timeChanged(timespan: Timespan) {
        this.updateTime(timespan);
    }

    public jumpToDate(date: Date) {
        this.updateTime(this.timeSrvc.centerTimespan(this.timespan, date));
    }

    public openTimeSettings() {
        const ref = this.modalService.open(ModalTimeseriesTimespanComponent);
        (ref.componentInstance as ModalTimeseriesTimespanComponent).timespan = this.timespan;
        (ref.componentInstance as ModalTimeseriesTimespanComponent).onTimespanChanged
            .subscribe((timespan: Timespan) => this.updateTime(timespan));
    }

    private updateTime(timespan: Timespan) {
        this.timeseriesService.setTimespan(timespan);
        this.timespan = timespan;
    }

    public updateOptions(options: DatasetOptions, internalId: string) {
        this.timeseriesService.updateDatasetOptions(options, internalId);
    }

    public editOption(options: DatasetOptions) {
        const ref = this.modalService.open(ModalOptionsEditorComponent);
        (ref.componentInstance as ModalOptionsEditorComponent).options = options;
    }

    public showGeometry(geometry: GeoJSON.GeoJsonObject) {
        const ref = this.modalService.open(ModalGeometryViewerComponent);
        (ref.componentInstance as ModalGeometryViewerComponent).geometry = geometry;
    }

    public highlight(id: string) {
        this.highlightId = id;
    }

    public onOverviewLoading(loading: boolean) {
        this.overviewLoading = loading;
        this.cdr.detectChanges();
    }

}
