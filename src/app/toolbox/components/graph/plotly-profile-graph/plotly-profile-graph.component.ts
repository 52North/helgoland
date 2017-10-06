import { AfterViewInit, Component, ElementRef, EventEmitter, IterableDiffers, Output, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as Plotly from 'plotly.js/lib/core';

import { ProfileDataEntry } from '../../../model/api/data';
import { Timespan } from '../../../model/internal/time-interval';
import { DatasetGraphComponent } from '../datasetGraphComponent';
import { IDataset } from './../../../model/api/dataset/idataset';
import { TimedDatasetOptions } from './../../../model/api/dataset/options';
import { ApiInterface } from './../../../services/api-interface/api-interface.service';
import { InternalIdHandler } from './../../../services/api-interface/internal-id-handler.service';
import { Time } from './../../../services/time/time.service';
import { GraphHighlight } from './../datasetGraphComponent';

interface RawData {
    dataset: IDataset;
    datas: Array<ProfileDataEntry>;
    options: Array<TimedDatasetOptions>;
}

const LINE_WIDTH_SELECTED = 5;
const LINE_WIDTH = 2;
const MARKER_SIZE_SELECTED = 10;
const MARKER_SIZE = 6;

@Component({
    selector: 'n52-plotly-profile-graph',
    templateUrl: './plotly-profile-graph.component.html',
    styleUrls: ['./plotly-profile-graph.component.scss']
})
export class PlotlyProfileGraphComponent extends DatasetGraphComponent<Array<TimedDatasetOptions>> implements AfterViewInit {

    @Output()
    public onHighlight: EventEmitter<GraphHighlight> = new EventEmitter();

    @ViewChild('plotly') plotlyElem: ElementRef;
    private plotlyArea: any;

    private preparedData: Array<ScatterData> = [];
    private rawData: Map<string, RawData> = new Map();
    private counterXAxis = 0;
    private counterYAxis = 0;

    // private layout: Partial<Plotly.Layout> = {
    private layout: any = {
        autosize: true,
        showlegend: false,
        dragmode: 'pan',
        margin: {
            l: 40,
            r: 10,
            b: 40,
            t: 10
            // pad: 100
        },
        hovermode: 'closest'
    };

    private settings: Partial<Plotly.Config> = {
        displayModeBar: false,
        modeBarButtonsToRemove: [
            'sendDataToCloud',
            'hoverCompareCartesian'
        ],
        displaylogo: false,
        showTips: false,
        scrollZoom: true
    };

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: ApiInterface,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time
    ) {
        super(iterableDiffers, api, datasetIdResolver, timeSrvc);
    }

    ngAfterViewInit(): void {
        this.plotlyArea = this.plotlyElem.nativeElement;
        this.drawChart();
    }

    protected timeIntervalChanges(): void { }

    protected addDataset(id: string, url: string): void {
        this.api.getDataset(id, url).subscribe(dataset => {
            const options = this.datasetOptions.get(dataset.internalId);
            options.forEach(option => {
                if (option.timestamp) {
                    const timespan = new Timespan(new Date(option.timestamp), new Date(option.timestamp));
                    this.api.getData<ProfileDataEntry>(id, url, timespan).subscribe((data) => {
                        if (data.values.length === 1) {
                            if (this.rawData.has(dataset.internalId)) {
                                this.rawData.get(dataset.internalId).datas.push(data.values[0]);
                                this.rawData.get(dataset.internalId).options.push(option);
                            } else {
                                this.rawData.set(dataset.internalId, {
                                    dataset: dataset,
                                    datas: [data.values[0]],
                                    options: [option]
                                });
                            }
                        }
                        this.drawChart();
                    });
                }
            });
        });
    }

    protected removeDataset(internalId: string): void {
        this.rawData.delete(internalId);
        this.drawChart();
    }

    protected setSelectedId(internalId: string): void {
        this.drawChart();
    }

    protected removeSelectedId(internalId: string): void {
        this.drawChart();
    }

    protected graphOptionsChanged(options: any): void { }

    protected datasetOptionsChanged(internalId: string, options: Array<TimedDatasetOptions>, firstChange: boolean): void {
        if (!firstChange) {
            // remove unused options
            const removedIdx = this.rawData.get(internalId).options.findIndex(option => {
                const idx = options.findIndex(e => e.timestamp === option.timestamp);
                if (idx === -1) {
                    return true;
                }
            });
            if (removedIdx > -1) {
                this.rawData.get(internalId).options.splice(removedIdx, 1);
                this.rawData.get(internalId).datas.splice(removedIdx, 1);
            }
            this.drawChart();
        }
    }

    protected onResize(): void {
        this.redrawChart();
    }

    private processData() {
        this.clearLayout();
        this.clearData();
        this.rawData.forEach(dataEntry => {
            dataEntry.options.forEach((option, key) => {
                if (option.visible) {
                    const x = new Array<number>();
                    const y = new Array<number>();
                    const selected = this.selectedDatasetIds.indexOf(dataEntry.dataset.internalId) >= 0;
                    dataEntry.datas[key].value.forEach(entry => {
                        x.push(entry.value);
                        y.push(entry.vertical);
                    });
                    const prepared: ScatterData = {
                        x: x,
                        y: y,
                        type: 'scatter',
                        name: '',
                        timestamp: option.timestamp,
                        id: dataEntry.dataset.internalId,
                        yaxis: this.createYAxis(dataEntry.dataset, dataEntry.datas[key]),
                        xaxis: this.createXAxis(dataEntry.dataset, dataEntry.datas[key]),
                        // hovertext: dataEntry.label,
                        line: {
                            color: option.color,
                            width: selected ? LINE_WIDTH_SELECTED : LINE_WIDTH
                        },
                        marker: {
                            size: selected ? MARKER_SIZE_SELECTED : MARKER_SIZE
                        }
                    };
                    this.preparedData.push(prepared);
                }
            });
        });

        this.updateAxis();
    }

    private createXAxis(dataset: IDataset, data: ProfileDataEntry): string {
        let axis;
        for (const key in this.layout) {
            if (this.layout.hasOwnProperty(key) && key.startsWith('xaxis') && this.layout[key].title === dataset.uom) {
                axis = this.layout[key];
            }
        }
        const range = d3.extent(data.value, (d) => d.value);
        if (!axis) {
            this.counterXAxis = this.counterXAxis + 1;
            axis = this.layout['xaxis' + this.counterXAxis] = {
                id: 'x' + (this.counterXAxis > 1 ? this.counterXAxis : ''),
                anchor: 'free',
                title: dataset.uom,
                zeroline: true,
                hoverformat: '.2f',
                showline: false,
                range: [range[0], range[1]],
                overlaying: '',
                // rangemode: 'tozero',
                fixedrange: false
            };
            if (this.counterXAxis !== 1) {
                axis.overlaying = 'x';
            }
        } else {
            axis.range = d3.extent([range[0], range[1], axis.range[0], axis.range[1]]);
        }
        return axis.id;
    }

    private createYAxis(dataset: IDataset, data: ProfileDataEntry): string {
        let axis;
        // find axis
        for (const key in this.layout) {
            if (this.layout.hasOwnProperty(key) &&
                key.startsWith('yaxis') &&
                this.layout[key].title === data.verticalUnit) {
                axis = this.layout[key];
            }
        }
        if (!axis) {
            // add axis
            this.counterYAxis = this.counterYAxis + 1;
            axis = this.layout[('yaxis' + this.counterYAxis)] = {
                id: 'y' + (this.counterYAxis > 1 ? this.counterYAxis : ''),
                // zeroline: true,
                anchor: 'free',
                hoverformat: '.2r',
                side: 'left',
                autorange: 'reversed',
                showline: false,
                overlaying: '',
                title: data.verticalUnit,
                fixedrange: false
            };
            if (this.counterYAxis !== 1) {
                axis.overlaying = 'y';
            }
        }
        return axis.id;
    }

    private updateAxis() {
        if (this.counterYAxis > 1) {
            for (const key in this.layout) {
                if (this.layout.hasOwnProperty(key) && key.startsWith('xaxis')) {
                    this.layout[key].domain = [(0.1 * this.counterYAxis) - 0.1, 1];
                }
            }
            let yaxisCount = 0;
            for (const key in this.layout) {
                if (this.layout.hasOwnProperty(key) && key.startsWith('yaxis')) {
                    this.layout[key].position = 0.1 * yaxisCount;
                    yaxisCount += 1;
                }
            }
        }
        if (this.counterXAxis > 1) {
            for (const key in this.layout) {
                if (this.layout.hasOwnProperty(key) && key.startsWith('yaxis')) {
                    this.layout[key].domain = [(0.06 * this.counterXAxis) - 0.06, 1];
                }
            }
            let xaxisCount = 0;
            for (const key in this.layout) {
                if (this.layout.hasOwnProperty(key) && key.startsWith('xaxis')) {
                    this.layout[key].position = 0.06 * xaxisCount;
                    xaxisCount += 1;
                }
            }
        }
        // add offset to xaxis ranges
        for (const key in this.layout) {
            if (this.layout.hasOwnProperty(key) && key.startsWith('xaxis')) {
                const range = this.layout[key].range;
                const rangeOffset = (range[1] - range[0]) * 0.05;
                this.layout[key].range = [range[0] - rangeOffset, range[1] + rangeOffset];
            }
        }
    }

    private drawChart() {
        if (this.plotlyArea) {
            this.processData();
            Plotly.newPlot(this.plotlyArea, this.preparedData, this.layout, this.settings);
        }

        this.plotlyArea.on('plotly_hover', (entry: any) => {
            if (entry.points.length === 1) {
                this.onHighlight.emit({
                    internalId: entry.points[0].data.id,
                    dataIndex: entry.points[0].pointNumber
                });
            }
        });
    }

    private clearLayout() {
        // todo remove yaxis
        for (const key in this.layout) {
            if (this.layout.hasOwnProperty(key) && (key.startsWith('yaxis') || key.startsWith('xaxis'))) {
                delete this.layout[key];
            }
        }
        // reset counter
        this.counterYAxis = 0;
        this.counterXAxis = 0;
    }

    private clearData() {
        this.preparedData = [];
    }

    private redrawChart() {
        if (this.plotlyArea) {
            Plotly.relayout(this.plotlyArea, {});
        }
    }
}

interface ScatterData extends Partial<Plotly.ScatterData> {
    id: string;
    timestamp: number;
}
