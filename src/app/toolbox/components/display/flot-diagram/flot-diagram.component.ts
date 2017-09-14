import {
    AfterViewInit,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import * as moment from 'moment';

import { Plot } from '../../../model/internal/flot/plot';
import { Data } from './../../../model/api/data';
import { IDataset } from './../../../model/api/dataset/idataset';
import { DataSeries } from './../../../model/internal/flot/dataSeries';
import { PlotOptions } from './../../../model/internal/flot/plotOptions';
import { Timespan } from './../../../model/internal/timespan';

declare var $: any;

const equal = require('deep-equal');

@Component({
    selector: 'n52-flot-diagram',
    templateUrl: './flot-diagram.component.html',
    styleUrls: ['./flot-diagram.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FlotDiagramComponent implements AfterViewInit, DoCheck {

    @ViewChild('flot') flotElem: ElementRef;

    @Input()
    public datasets: Array<IDataset>;

    private oldDatasets: Array<IDataset>;

    @Input()
    public data: Array<Data<[number, number]>>;

    private oldData: Array<Data<[number, number]>>;

    @Input()
    public timespan: Timespan;

    @Input()
    public options: PlotOptions;

    private oldOptions: PlotOptions;

    @Output()
    public onTimespanChanged: EventEmitter<Timespan> = new EventEmitter();

    private plotarea: any;

    private preparedData: Array<DataSeries>;

    private plotOptions: PlotOptions;

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.plotChart();
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

    private changeTime(from: Date, to: Date) {
        this.onTimespanChanged.emit(new Timespan(from, to));
    }

    public ngDoCheck() {
        if (this.plotarea) {
            let replot = false;
            if (!equal(this.oldDatasets, this.datasets)) {
                replot = true;
                this.oldDatasets = JSON.parse(JSON.stringify(this.datasets));
            }
            if (!equal(this.oldOptions, this.options)) {
                replot = true;
                this.oldOptions = JSON.parse(JSON.stringify(this.options));
            }
            if (!equal(this.oldData, this.data)) {
                replot = true;
                this.oldData = JSON.parse(JSON.stringify(this.data));
            }
            if (replot && this.datasets && this.data && this.datasets.length === this.data.length) {
                this.plotChart();
            }
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
        this.plotOptions = this.options;
        this.plotOptions.yaxes = [];
        this.plotOptions.xaxis.min = this.timespan.from.getTime();
        this.plotOptions.xaxis.max = this.timespan.to.getTime();
        this.datasets.forEach((entry, datasetIdx) => {
            if (this.data[datasetIdx] && entry.styles.visible) {
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
                    id: entry.id,
                    url: entry.url,
                    color: entry.styles.color,
                    data: this.data[datasetIdx].values,
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
                                const dataset = this.datasets.find((entry) => entry.id === elem.id && entry.url === elem.url);
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
                    const yaxisLabel = $('<div class="axisLabel yaxisLabel" style=left:' + box.left + 'px;></div>').text(axis.options.uom)
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
}
