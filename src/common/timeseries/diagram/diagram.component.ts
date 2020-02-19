import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Data, DatasetOptions, IDataEntry, Service, Time, Timespan } from '@helgoland/core';
import { D3PlotOptions } from '@helgoland/d3';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalGeometryViewerComponent } from '../../components/modal-geometry-viewer/modal-geometry-viewer.component';
import { ModalOptionsEditorComponent } from '../../components/modal-options-editor/modal-options-editor.component';
import {
    ModalTimeseriesTimespanComponent,
} from '../../components/modal-timeseries-timespan/modal-timeseries-timespan.component';
import { TimeseriesRouter } from '../services/timeseries-router.service';
import { TimeseriesService } from './../services/timeseries.service';
import { TimeseriesDiagramPermalink } from './diagram-permalink.service';

@Component({
    selector: 'n52-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.scss']
})
export class TimeseriesDiagramComponent implements OnInit {

    public datasetIds: Array<string>;
    public datasetOptions: Map<string, DatasetOptions>;
    public selectedIds: Array<string> = new Array();
    public highlightId: string;
    public data: Array<Data<IDataEntry>>;
    public timespan: Timespan;
    public selectedProvider: Service;

    public diagramOptions: D3PlotOptions = {
        grid: true,
        showTimeLabel: false,
        showReferenceValues: true,
        requestBeforeAfterValues: true
    };
    public overviewOptions: D3PlotOptions = {
        grid: true,
        yaxis: false,
        overview: true,
        showTimeLabel: false
    };

    public overviewGraphLoading: boolean;
    public graphLoading: boolean;

    constructor(
        private timeseriesService: TimeseriesService,
        private timeSrvc: Time,
        public permalinkSrvc: TimeseriesDiagramPermalink,
        private modalService: NgbModal,
        private cdr: ChangeDetectorRef,
        public router: TimeseriesRouter
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

    public deleteAllTs() {
        this.timeseriesService.removeAllDatasets();
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
        (ref.componentInstance as ModalTimeseriesTimespanComponent).timespanChanged
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
        (ref.componentInstance as ModalOptionsEditorComponent).out.subscribe((resOptions: DatasetOptions) => {
            this.updateOptions(resOptions, resOptions.internalId);
        });
    }

    public showGeometry(geometry: GeoJSON.GeoJsonObject) {
        const ref = this.modalService.open(ModalGeometryViewerComponent, { size: 'lg' });
        (ref.componentInstance as ModalGeometryViewerComponent).geometry = geometry;
    }

    public highlight(id: string) {
        this.highlightId = id;
    }

    public onOverviewLoading(loading: boolean) {
        this.overviewGraphLoading = loading;
        this.cdr.detectChanges();
    }

    public onGraphLoading(loading: boolean) {
        this.graphLoading = loading;
    }

}
