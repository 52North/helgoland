import './jquery.flot.navigate';
import './jquery.flot.selection';
import './jquery.flot.touch';

import { AfterViewInit, Component, ElementRef, IterableDiffers, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    ApiInterface,
    Data,
    DataSeries,
    DatasetOptions,
    IDataset,
    InternalIdHandler,
    Plot,
    PlotOptions,
    Time,
    Timeseries,
    Timespan,
} from 'helgoland-toolbox';

import { DatasetGraphComponent } from '../datasetGraphComponent';

declare var $: any;

@Component({
    selector: 'n52-flot-timeseries-graph',
    templateUrl: './flot-timeseries-graph.component.html',
    styleUrls: ['./flot-timeseries-graph.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FlotTimeseriesGraphComponent extends DatasetGraphComponent<DatasetOptions, PlotOptions> implements AfterViewInit {

    @ViewChild('flot') flotElem: ElementRef;

    private plotarea: any;

    private preparedData: Array<DataSeries> = Array();

    private plotOptions: PlotOptions;

    private timeseriesMap: Map<string, Timeseries> = new Map();

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: ApiInterface,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time
    ) {
        super(iterableDiffers, api, datasetIdResolver, timeSrvc);
    }

    public ngAfterViewInit() {
        this.plotarea = this.flotElem.nativeElement;

        $(this.plotarea).bind('plotzoom', (evt: any, plot: any) => {
            const xaxis = plot.getXAxes()[0];
            this.changeTime(xaxis.min, xaxis.max);
        });

        // plot pan ended event
        $(this.plotarea).bind('plotpanEnd', (evt: any, plot: any) => {
            const xaxis = plot.getXAxes()[0];
            this.changeTime(xaxis.min, xaxis.max);
        });

        $(this.plotarea).bind('touchended', (evt: any, plot: any) => {
            this.changeTime(plot.xaxis.from, plot.xaxis.to);
        });

        // plot selected event
        $(this.plotarea).bind('plotselected', (evt: any, ranges: any) => {
            this.changeTime(ranges.xaxis.from, ranges.xaxis.to);
        });

        this.plotGraph();
    }

    protected graphOptionsChanged(options: PlotOptions) {
        this.plotOptions = options;
        this.plotOptions.yaxes = [];
        this.timeIntervalChanges();
    }

    protected setSelectedId(internalId: string) {
        const tsData = this.preparedData.find(e => e.internalId === internalId);
        tsData.selected = true;
        tsData.lines.lineWidth = 5;
        tsData.bars.lineWidth = 5;
        this.plotGraph();
    }

    protected removeSelectedId(internalId: string) {
        const tsData = this.preparedData.find(e => e.internalId === internalId);
        tsData.selected = false;
        tsData.lines.lineWidth = 1;
        tsData.bars.lineWidth = 1;
        this.plotGraph();
    }

    protected timeIntervalChanges() {
        this.timeseriesMap.forEach(timeseries => {
            this.loadTsData(timeseries);
        });
    }

    protected removeDataset(internalId: string) {
        this.timeseriesMap.delete(internalId);
        this.removePreparedData(internalId);
        this.plotGraph();
    }

    protected addDataset(internalId: string, url: string): void {
        this.api.getSingleTimeseries(internalId, url)
            .subscribe((timeseries: Timeseries) => this.addTimeseries(timeseries));
    }

    protected datasetOptionsChanged(internalId: string, options: DatasetOptions): void {
        if (this.timeseriesMap.has(internalId)) {
            this.loadTsData(this.timeseriesMap.get(internalId));
        }
    }

    protected onResize(): void {
        this.plotGraph();
    }

    private changeTime(from: number, to: number) {
        this.onTimespanChanged.emit(new Timespan(from, to));
    }

    private plotGraph() {
        if (this.preparedData && this.preparedData.length !== 0 && this.plotOptions) {
            this.prepareAxisPos();
            this.plotOptions.xaxis.min = this.timespan.from;
            this.plotOptions.xaxis.max = this.timespan.to;
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

    private prepareData(timeseries: Timeseries, data: Data<[number, number]>) {
        const dataIdx = this.preparedData.findIndex(e => e.internalId === timeseries.internalId);
        const styles = this.datasetOptions.get(timeseries.internalId);
        const label = this.createAxisLabel(timeseries);
        let axePos;
        const axe = this.plotOptions.yaxes.find((yaxisEntry, idx) => {
            axePos = idx + 1;
            return yaxisEntry.uom === label;
        });
        if (axe) {
            if (axe.internalIds.indexOf(timeseries.internalId) < 0) {
                axe.internalIds.push(timeseries.internalId);
                axe.tsColors.push(styles.color);
            }
        } else {
            this.plotOptions.yaxes.push({
                uom: timeseries.parameters.phenomenon.label + ' [' + timeseries.uom + ']',
                tsColors: [styles.color],
                internalIds: [timeseries.internalId],
                min: null
            });
            axePos = this.plotOptions.yaxes.length;
        }
        const dataEntry = {
            internalId: timeseries.internalId,
            color: styles.color,
            data: styles.visible ? data.values : [],
            points: {
                fillColor: styles.color
            },
            lines: {
                lineWidth: 1
            },
            bars: {
                lineWidth: 1
            }
        };
        if (dataIdx >= 0) {
            this.preparedData[dataIdx] = dataEntry;
        } else {
            this.preparedData.push(dataEntry);
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
            // plotArea.append('<div class="graph-annotation">Daten ohne Gewähr</div>');
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
                            const selections: Array<string> = [];
                            $.each(plot.getData(), (index: number, elem: any) => {
                                if (target.data('axis.n') === elem.yaxis.n) {
                                    elem.selected = !selected;
                                    if (elem.selected) {
                                        selections.push(elem.internalId);
                                    }
                                }
                            });
                            this.onDatasetSelected.emit(selections);
                            if (!selected) {
                                target.addClass('selected');
                            }
                            this.plotGraph();
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
            const datasetOptions = this.datasetOptions.get(timeseries.internalId);
            this.api.getTsData<[number, number]>(timeseries.id, timeseries.url, buffer,
                {
                    format: 'flot',
                    generalize: datasetOptions.generalize
                })
                .subscribe(result => {
                    this.prepareData(timeseries, result);
                    this.plotGraph();
                });
        }
    }

}
