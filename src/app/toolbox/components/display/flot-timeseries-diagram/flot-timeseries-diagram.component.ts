import { InternalIdHandler } from './../../../services/api-interface/internal-id-handler.service';
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
import { Timeseries } from './../../../model/api/timeseries';
import { DatasetGraphComponent, GraphMessage, StylesMap } from './../../../model/internal/datasetGraphComponent';
import { DataSeries } from './../../../model/internal/flot/dataSeries';
import { PlotOptions } from './../../../model/internal/flot/plotOptions';
import { TimeInterval, Timespan } from './../../../model/internal/time-interval';
import { ApiInterface } from './../../../services/api-interface/api-interface.service';
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
    public seriesOptions: StylesMap;
    private oldSeriesOptions: StylesMap;

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

    private preparedData: Array<DataSeries>;

    private plotOptions: PlotOptions;

    private timeseriesMap: Map<string, Timeseries> = new Map();
    private dataMap: Map<string, Data<[number, number]>> = new Map();
    private timespan: Timespan;

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.plotChart();
    }

    constructor(
        private iterableDiffers: IterableDiffers,
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
            }
            // TODO get new data for all datasets
            this.loadAllTsData();
        }
    }

    private changeTime(from: Date, to: Date) {
        this.onTimespanChanged.emit(new Timespan(from, to));
    }

    public ngDoCheck() {
        let replot = false;
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
                console.log('Added: ' + addedItem.item);
                // TODO update Datasets
            });
            selectedSeriesIdsChanges.forEachRemovedItem(removedItem => {
                console.log('Removed: ' + removedItem.item);
                // TODO update Datasets
            });
        }

        if (!equal(this.oldGraphOptions, this.graphOptions)) {
            replot = true;
            this.oldGraphOptions = JSON.parse(JSON.stringify(this.graphOptions));
        }

        if (!equal(this.oldSeriesOptions, this.seriesOptions)) {
            replot = true;
            this.oldSeriesOptions = JSON.parse(JSON.stringify(this.seriesOptions));
        }
    }

    private plotChart() {
        this.updateData();
        if (this.preparedData && this.preparedData.length !== 0) {
            console.log('plotchart');
            const plotObj: Plot = $.plot(this.plotarea, this.preparedData, this.plotOptions);
            this.createPlotAnnotation(this.plotarea, this.plotOptions);
            this.createYAxis(plotObj);
            this.setSelection(plotObj, this.plotOptions);
        } else {
            $(this.plotarea).empty();
        }
    }

    private updateData() {
        this.preparedData = [];
        this.plotOptions = this.graphOptions;
        this.plotOptions.yaxes = [];
        this.plotOptions.xaxis.min = this.timespan.from.getTime();
        this.plotOptions.xaxis.max = this.timespan.to.getTime();
        this.timeseriesMap.forEach((entry) => {
            if (this.dataMap.has(entry.internalId) && entry.styles.visible) {
                const label = this.createAxisLabel(entry);
                let axePos;
                const axe = this.plotOptions.yaxes.find((yaxisEntry, idx) => {
                    axePos = idx + 1;
                    return yaxisEntry.uom === label;
                });
                if (axe) {
                    axe.tsColors.push(entry.styles.color);
                } else {
                    this.plotOptions.yaxes.push({
                        uom: entry.parameters.phenomenon.label + ' [' + entry.uom + ']',
                        tsColors: [entry.styles.color],
                        min: null
                    });
                    axePos = this.plotOptions.yaxes.length;
                }
                this.preparedData.push({
                    internalId: entry.internalId,
                    color: entry.styles.color,
                    data: this.dataMap.get(entry.internalId).values,
                    selected: entry.styles.selected,
                    points: {
                        fillColor: entry.styles.color
                    },
                    lines: {
                        lineWidth: entry.styles.selected ? 5 : 1
                    },
                    bars: {
                        lineWidth: entry.styles.selected ? 5 : 1
                    },
                    yaxis: axePos
                });
            }
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
                                // const dataset = this.timeseriesMap.find((entry) => entry.id === elem.id && entry.url === elem.url);
                                const dataset = this.timeseriesMap.get(elem.internalId);
                                if (target.data('axis.n') === elem.yaxis.n) {
                                    elem.selected = !selected;
                                    dataset.styles.selected = !selected;
                                } else {
                                    dataset.styles.selected = false;
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
        if (this.timespan) {
            timeseries.styles.loading = true;
            this.dataMap.delete(timeseries.internalId);
            const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, 0.2);
            this.api.getTsData<[number, number]>(timeseries.id, timeseries.url, buffer, { format: 'flot', generalize: false })
                .subscribe(result => {
                    timeseries.styles.loading = false;
                    this.dataMap.set(timeseries.internalId, result);
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
        this.dataMap.delete(internalId);
        this.timeseriesMap.delete(internalId);
        this.plotChart();
    }

}
