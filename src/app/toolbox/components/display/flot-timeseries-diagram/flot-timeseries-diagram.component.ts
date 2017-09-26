import {
    AfterViewInit,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    IterableDiffer,
    IterableDiffers,
    KeyValueDiffers,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import * as moment from 'moment';

import { Data } from '../../../model/api/data';
import { Plot } from '../../../model/internal/flot/plot';
import { IDataset } from './../../../model/api/dataset/idataset';
import { DatasetOptions } from './../../../model/api/dataset/options';
import { Timeseries } from './../../../model/api/dataset/timeseries';
import { DatasetGraphComponent, GraphMessage } from './../../../model/internal/datasetGraphComponent';
import { DataSeries } from './../../../model/internal/flot/dataSeries';
import { PlotOptions } from './../../../model/internal/flot/plotOptions';
import { BufferedTime, TimeInterval, Timespan } from './../../../model/internal/time-interval';
import { ApiInterface } from './../../../services/api-interface/api-interface.service';
import { InternalIdHandler } from './../../../services/api-interface/internal-id-handler.service';
import { Time } from './../../../services/time/time.service';

declare var $: any;

const equal = require('deep-equal');

@Component({
    selector: 'n52-flot-timeseries-diagram',
    templateUrl: './flot-timeseries-diagram.component.html',
    styleUrls: ['./flot-timeseries-diagram.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FlotTimeseriesDiagramComponent implements AfterViewInit, DoCheck, OnChanges, DatasetGraphComponent {

    @ViewChild('flot') flotElem: ElementRef;

    @Input()
    public seriesIds: Array<string>;
    private seriesIdsDiffer: IterableDiffer<string>;

    @Input()
    public selectedSeriesIds: Array<string>;
    private selectedSeriesIdsDiffer: IterableDiffer<string>;

    @Input()
    public timeInterval: TimeInterval;

    @Input()
    public seriesOptions: Map<string, DatasetOptions>;
    public oldSeriesOptions: Map<string, DatasetOptions> = new Map();

    @Input()
    public graphOptions: any;
    private oldGraphOptions: any;

    @Output()
    public onSeriesSelected: EventEmitter<string> = new EventEmitter();

    @Output()
    public onTimespanChanged: EventEmitter<Timespan> = new EventEmitter();

    @Output()
    public onMessageThrown: EventEmitter<GraphMessage> = new EventEmitter();

    private plotarea: any;

    private preparedData: Array<DataSeries> = Array();

    private plotOptions: PlotOptions;

    private timeseriesMap: Map<string, Timeseries> = new Map();

    private timespan: Timespan;

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.plotChart();
    }

    constructor(
        private iterableDiffers: IterableDiffers,
        private keyValueDiffers: KeyValueDiffers,
        private api: ApiInterface,
        private datasetIdResolver: InternalIdHandler,
        private timeSrvc: Time
    ) {
        this.seriesIdsDiffer = this.iterableDiffers.find([]).create();
        this.selectedSeriesIdsDiffer = this.iterableDiffers.find([]).create();
    }

    public ngAfterViewInit() {
        this.plotarea = this.flotElem.nativeElement;

        $(this.plotarea).bind('plotzoom', (evt: any, plot: any) => {
            const xaxis = plot.getXAxes()[0];
            const from = moment(xaxis.min).toDate();
            const till = moment(xaxis.max).toDate();
            this.changeTime(from, till);
        });

        // plot pan ended event
        $(this.plotarea).bind('plotpanEnd', (evt: any, plot: any) => {
            const xaxis = plot.getXAxes()[0];
            this.changeTime(moment(xaxis.min).toDate(), moment(xaxis.max).toDate());
        });

        $(this.plotarea).bind('touchended', (evt: any, plot: any) => {
            const xaxis = plot.xaxis;
            const from = moment(xaxis.from).toDate();
            const till = moment(xaxis.to).toDate();
            this.changeTime(from, till);
        });

        // plot selected event
        $(this.plotarea).bind('plotselected', (evt: any, ranges: any) => {
            this.changeTime(moment(ranges.xaxis.from).toDate(), moment(ranges.xaxis.to).toDate());
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.timeInterval) {
            if (this.timeInterval instanceof Timespan) {
                this.timespan = this.timeInterval;
            } else if (this.timeInterval instanceof BufferedTime) {
                // TODO convert if TimeBuffer
            }
            this.loadAllTsData();
        }
    }

    private changeTime(from: Date, to: Date) {
        this.onTimespanChanged.emit(new Timespan(from, to));
    }

    public ngDoCheck() {
        const seriesIdsChanges = this.seriesIdsDiffer.diff(this.seriesIds);
        if (seriesIdsChanges) {
            seriesIdsChanges.forEachAddedItem(addedItem => {
                const internalId = this.datasetIdResolver.resolveInternalId(addedItem.item);
                this.api.getSingleTimeseries(internalId.id, internalId.url)
                    .subscribe((timeseries: Timeseries) => this.addTimeseries(timeseries));
            });
            seriesIdsChanges.forEachRemovedItem(removedItem => {
                this.removeTimeseries(removedItem.item);
            });
        }

        const selectedSeriesIdsChanges = this.selectedSeriesIdsDiffer.diff(this.selectedSeriesIds);
        if (selectedSeriesIdsChanges) {
            selectedSeriesIdsChanges.forEachAddedItem(addedItem => {
                this.setSelectedId(addedItem.item);
            });
            selectedSeriesIdsChanges.forEachRemovedItem(removedItem => {
                this.removeSelectedId(removedItem.item);
            });
        }

        if (!equal(this.oldGraphOptions, this.graphOptions)) {
            this.plotOptions = JSON.parse(JSON.stringify(this.graphOptions));
            this.plotOptions.yaxes = [];
            this.oldGraphOptions = JSON.parse(JSON.stringify(this.graphOptions));
            this.optionsChanged();
        }

        this.seriesOptions.forEach((value, key) => {
            if (!equal(value, this.oldSeriesOptions.get(key))) {
                this.oldSeriesOptions.set(key, JSON.parse(JSON.stringify(this.seriesOptions.get(key))));
                if (this.timeseriesMap.has(key)) {
                    this.loadTsData(this.timeseriesMap.get(key));
                }
            }
        });
    }

    private optionsChanged() {
        this.loadAllTsData();
    }

    private plotChart() {
        if (this.preparedData && this.preparedData.length !== 0 && this.plotOptions) {
            this.prepareAxisPos();
            this.plotOptions.xaxis.min = this.timespan.from.getTime();
            this.plotOptions.xaxis.max = this.timespan.to.getTime();
            const plotObj: Plot = $.plot(this.plotarea, this.preparedData, this.plotOptions);
            this.createPlotAnnotation(this.plotarea, this.plotOptions);
            this.createYAxis(plotObj);
            this.setSelection(plotObj, this.plotOptions);
        } else {
            $(this.plotarea).empty();
        }
    }

    private removePreparedData(internalId: string) {
        // remove from preparedData Array
        const idx = this.preparedData.findIndex(entry => entry.internalId === internalId);
        if (idx >= 0) { this.preparedData.splice(idx, 1); }
        // remove from axis
        const axisIdx = this.plotOptions.yaxes.findIndex(entry => {
            const internalIdIndex = entry.internalIds.indexOf(internalId);
            if (internalIdIndex > -1) {
                if (entry.internalIds.length === 1) {
                    return true;
                } else {
                    entry.internalIds.splice(internalIdIndex, 1);
                    entry.tsColors.splice(internalIdIndex, 1);
                }
            }
            return false;
        });
        if (axisIdx > -1) {
            this.plotOptions.yaxes.splice(axisIdx, 1);
        }
    }

    private setSelectedId(internalId: string) {
        const tsData = this.preparedData.find(e => e.internalId === internalId);
        tsData.selected = true;
        tsData.lines.lineWidth = 5;
        tsData.bars.lineWidth = 5;
        this.plotChart();
    }

    private removeSelectedId(internalId: string) {
        const tsData = this.preparedData.find(e => e.internalId === internalId);
        tsData.selected = false;
        tsData.lines.lineWidth = 1;
        tsData.bars.lineWidth = 1;
        this.plotChart();
    }

    private prepareData(timeseries: Timeseries, data: Data<[number, number]>) {
        this.removePreparedData(timeseries.internalId);
        const styles = this.seriesOptions.get(timeseries.internalId);
        if (styles.visible) {
            const label = this.createAxisLabel(timeseries);
            let axePos;
            const axe = this.plotOptions.yaxes.find((yaxisEntry, idx) => {
                axePos = idx + 1;
                return yaxisEntry.uom === label;
            });
            if (axe) {
                axe.internalIds.push(timeseries.internalId);
                axe.tsColors.push(styles.color);
            } else {
                this.plotOptions.yaxes.push({
                    uom: timeseries.parameters.phenomenon.label + ' [' + timeseries.uom + ']',
                    tsColors: [styles.color],
                    internalIds: [timeseries.internalId],
                    min: null
                });
                axePos = this.plotOptions.yaxes.length;
            }
            this.preparedData.push({
                internalId: timeseries.internalId,
                color: styles.color,
                data: data.values,
                points: {
                    fillColor: styles.color
                },
                lines: {
                    lineWidth: 1
                },
                bars: {
                    lineWidth: 1
                }
            });
        }
    }

    private prepareAxisPos() {
        // remove unused axes
        this.plotOptions.yaxes = this.plotOptions.yaxes.filter(entry => entry.internalIds.length !== 0);
        this.plotOptions.yaxes.forEach((xaxis, idx) => {
            xaxis.internalIds.forEach(id => {
                const temp = this.preparedData.find(dataEntry => dataEntry.internalId === id);
                temp.yaxis = idx + 1;
            });
        });
    }

    private createAxisLabel(dataset: IDataset): string {
        return dataset.parameters.phenomenon.label + ' [' + dataset.uom + ']';
    }

    private setSelection(plot: Plot, options: PlotOptions) {
        if (plot && options.selection.range) {
            plot.setSelection({
                xaxis: {
                    from: options.selection.range.from,
                    to: options.selection.range.to
                }
            }, true);
        }
    }

    private createPlotAnnotation(plotArea: any, options: PlotOptions) {
        if (options.annotation) {
            // plotArea.append('<div class="chart-annotation">Daten ohne Gewähr</div>');
        }
    }

    private createYAxis(plot: Plot) {
        if (plot.getOptions().yaxis.show) {
            // remove old labels
            $(plot.getPlaceholder()).find('.yaxisLabel').remove();

            // createYAxis
            $.each(plot.getAxes(), (i: number, axis: any) => {
                if (!axis.show) { return; }
                const box = axis.box;
                if (axis.direction === 'y') {
                    $('<div class="axisTargetStyle" style="position:absolute; left:'
                        + box.left + 'px; top:' + box.top + 'px; width:' + box.width + 'px; height:' + box.height + 'px"></div>')
                        .data('axis.n', axis.n)
                        .appendTo(plot.getPlaceholder());
                    $('<div class="axisTarget" style="position:absolute; left:'
                        + box.left + 'px; top:' + box.top + 'px; width:' + box.width + 'px; height:' + box.height + 'px"></div>')
                        .data('axis.n', axis.n)
                        .appendTo(plot.getPlaceholder())
                        .click((event: any) => {
                            const target = $(event.currentTarget);
                            let selected = false;
                            $.each($('.axisTarget'), (index: number, elem: any) => {
                                elem = $(elem);
                                if (target.data('axis.n') === elem.data('axis.n')) {
                                    selected = elem.hasClass('selected');
                                    return false; // break loop
                                }
                            });
                            $.each(plot.getData(), (index: number, elem: any) => {
                                const style = this.seriesOptions.get(elem.internalId);
                                if (target.data('axis.n') === elem.yaxis.n) {
                                    elem.selected = !selected;
                                    style.selected = !selected;
                                } else {
                                    style.selected = false;
                                }
                            });
                            if (!selected) {
                                target.addClass('selected');
                            }
                            this.plotChart();
                        });
                    const yaxisLabel = $('<div class="axisLabel yaxisLabel" style=left:'
                        + box.left + 'px;></div>').text(axis.options.uom)
                        .appendTo(plot.getPlaceholder())
                        .data('axis.n', axis.n);
                    if (axis.options.tsColors) {
                        $.each(axis.options.tsColors, (idx: number, color: string) => {
                            $('<span>').html('&nbsp;&#x25CF;').css('color', color).addClass('labelColorMarker').appendTo(yaxisLabel);
                        });
                    }
                    yaxisLabel.css('margin-left', -4 + (yaxisLabel.height() - yaxisLabel.width()) / 2);
                }
            });

            // set selection to axis
            plot.getData().forEach((elem: any) => {
                if (elem.selected) {
                    $('.flot-y' + elem.yaxis.n + '-axis').addClass('selected');
                    $.each($('.axisTarget'), (i: number, entry: Element) => {
                        if ($(entry).data('axis.n') === elem.yaxis.n) {
                            if (!$(entry).hasClass('selected')) {
                                $(entry).addClass('selected');
                                return false;
                            }
                        }
                    });
                    $.each($('.axisTargetStyle'), (i: number, entry: Element) => {
                        if ($(entry).data('axis.n') === elem.yaxis.n) {
                            if (!$(entry).hasClass('selected')) {
                                $(entry).addClass('selected');
                                return false;
                            }
                        }
                    });
                    $.each($('.axisLabel.yaxisLabel'), (i: number, entry: Element) => {
                        if ($(entry).data('axis.n') === elem.yaxis.n) {
                            if (!$(entry).hasClass('selected')) {
                                $(entry).addClass('selected');
                                return false;
                            }
                        }
                    });
                }
            });
        }
    }

    private addTimeseries(timeseries: Timeseries) {
        this.timeseriesMap.set(timeseries.internalId, timeseries);
        this.loadTsData(timeseries);
    }

    private loadTsData(timeseries: Timeseries) {
        if (this.timespan && this.plotOptions) {
            const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, 0.2);
            this.api.getTsData<[number, number]>(timeseries.id, timeseries.url, buffer, { format: 'flot', generalize: false })
                .subscribe(result => {
                    this.prepareData(timeseries, result);
                    this.plotChart();
                });
        }
    }

    private loadAllTsData() {
        this.timeseriesMap.forEach(timeseries => {
            this.loadTsData(timeseries);
        });
    }

    private removeTimeseries(internalId: string) {
        this.timeseriesMap.delete(internalId);
        this.removePreparedData(internalId);
        this.plotChart();
    }

}
