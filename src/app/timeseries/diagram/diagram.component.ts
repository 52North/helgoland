import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Data, DatasetOptions, IDataEntry, IDataset, PlotOptions, Service, Time, Timespan } from 'helgoland-toolbox';

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
        crosshair: {
            mode: 'x'
        },
        grid: {
            autoHighlight: true,
            hoverable: true
        },
        legend: {
            show: false
        },
        pan: {
            frameRate: 10,
            interactive: true
        },
        selection: {
            mode: null
        },
        series: {
            // downsample: {
            //   threshold: 0
            // },
            lines: {
                fill: false,
                show: true
            },
            points: {
                fill: true,
                radius: 2,
                show: false
            },
            //            points : {
            //                 show: true
            //            },
            shadowSize: 1
        },
        touch: {
            delayTouchEnded: 200,
            pan: 'x',
            scale: ''
        },
        xaxis: {
            mode: 'time',
            timezone: 'browser',
            // monthNames: monthNamesTranslaterServ.getMonthNames()
            //            timeformat: '%Y/%m/%d',
            // use these the following two lines to have small ticks at the bottom ob the diagram
            //            tickLength: 5,
            //            tickColor: '#000'
        },
        yaxis: {
            additionalWidth: 17,
            labelWidth: 50,
            min: null,
            panRange: false,
            show: true,
            // tickFormatter: function(val, axis) {
            //     var factor = axis.tickDecimals ? Math.pow(10, axis.tickDecimals) : 1;
            //     var formatted = '' + Math.round(val * factor) / factor;
            //     return formatted + '<br>' + this.uom;
            // }
        },
    };

    public overviewOptions: PlotOptions = {
        series: {
            // downsample: {
            //   threshold: 0
            // },
            points: {
                show: false,
                radius: 1
            },
            lines: {
                show: true,
                fill: false
            },
            shadowSize: 1
        },
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
        xaxis: {
            mode: 'time',
            timezone: 'browser',
            // monthNames: monthNamesTranslaterServ.getMonthNames()
        },
        yaxis: {
            show: false
        },
        legend: {
            show: false
        },
        touch: {
            pan: '',
            scale: ''
        }
    };

    @ViewChild('modalTimeseriesOptionsEditor')
    public modalTimeseriesOptionsEditor: TemplateRef<any>;

    @ViewChild('modalGeometryViewer')
    public modalGeometryViewer: TemplateRef<any>;
    public geometry: GeoJSON.GeoJsonObject;

    public editableOption: DatasetOptions;
    public tempColor: string;

    constructor(
        private timeseriesService: TimeseriesService,
        private timeSrvc: Time,
        private permalinkSrvc: TimeseriesDiagramPermalink,
        private modalService: NgbModal
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

    private updateTime(timespan: Timespan) {
        this.timeseriesService.setTimespan(timespan);
        this.timespan = timespan;
    }

    public updateOptions(options: DatasetOptions, internalId: string) {
        this.timeseriesService.updateDatasetOptions(options, internalId);
    }

    public editOption(options: DatasetOptions) {
        this.editableOption = options;
        this.modalService.open(this.modalTimeseriesOptionsEditor);
    }

    public showGeometry(geometry: GeoJSON.GeoJsonObject) {
        this.geometry = geometry;
        this.modalService.open(this.modalGeometryViewer);
    }

    public updateOption(option: DatasetOptions) {
        this.editableOption.color = this.tempColor;
        this.timeseriesService.updateDatasetOptions(this.editableOption, this.editableOption.internalId);
    }

    public highlight(id: string) {
        this.highlightId = id;
    }

}
