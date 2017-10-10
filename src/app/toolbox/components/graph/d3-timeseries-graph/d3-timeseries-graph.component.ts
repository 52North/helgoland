import { AfterViewInit, Component, ElementRef, IterableDiffers, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as L from 'leaflet';
import * as moment from 'moment';

import { LocatedTimeValueEntry } from '../../../model/api/data';
import { DatasetOptions } from '../../../model/api/dataset/options';
import { DatasetGraphComponent } from '../datasetGraphComponent';
import { IDataset } from './../../../model/api/dataset/idataset';
import { ApiInterface } from './../../../services/api-interface/api-interface.service';
import { InternalIdHandler } from './../../../services/api-interface/internal-id-handler.service';
import { Time } from './../../../services/time/time.service';

interface DataEntry extends LocatedTimeValueEntry {
    dist: number;
    tick: number;
    x: number;
    y: number;
    xDiagCoord?: number;
    latlng: L.LatLng;
}

export interface D3GraphOptions {
    axisType: AxisType;
    dotted: boolean;
}

export enum AxisType {
    Distance,
    Time,
    Ticks
}

@Component({
    selector: 'n52-d3-timeseries-graph',
    templateUrl: './d3-timeseries-graph.component.html',
    styleUrls: ['./d3-timeseries-graph.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class D3TimeseriesGraphComponent extends DatasetGraphComponent<DatasetOptions, D3GraphOptions> implements AfterViewInit {

    private datasetMap: Map<string, IDataset> = new Map();

    @ViewChild('dthree') d3Elem: ElementRef;

    private rawSvg: any;
    private graph: any;
    private height: number;
    private width: number;
    private margin = {
        top: 10,
        right: 10,
        bottom: 40,
        left: 50
    };
    private maxLabelwidth = 0;
    private lineFun: d3.Line<DataEntry>;
    private area: d3.Area<DataEntry>;
    private xScale: d3.ScaleLinear<number, number>;
    private yScale: d3.ScaleLinear<number, number>;
    private background: any;
    private focusG: any;
    private highlightFocus: any;
    private focuslabelValue: any;
    private focuslabelTime: any;
    private focuslabelY: any;
    private xAxisGen: d3.Axis<number | { valueOf(): number; }>;
    private yAxisGen: d3.Axis<number | { valueOf(): number; }>;
    private internalValues: Array<DataEntry> = [];
    private dragging: boolean;
    private dragStart: [number, number];
    private dragCurrent: [number, number];
    private dragRect: any;
    private dragRectG: any;

    private defaultGraphOptions: D3GraphOptions = {
        axisType: AxisType.Distance,
        dotted: false
    };

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: ApiInterface,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time
    ) {
        super(iterableDiffers, api, datasetIdResolver, timeSrvc);
        this.graphOptions = this.defaultGraphOptions;
    }

    public ngAfterViewInit(): void {
        this.rawSvg = d3.select(this.d3Elem.nativeElement)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.graph = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.height = this.calculateHeight();
        this.width = this.calculateWidth();

        this.lineFun = d3.line<DataEntry>()
            .x(this.calcXValue)
            .y(this.calcYValue)
            .curve(d3.curveLinear);

        this.area = d3.area<DataEntry>()
            .x(this.calcXValue)
            .y0(this.height)
            .y1(this.calcYValue)
            .curve(d3.curveLinear);

        this.drawLineGraph();
    }

    protected timeIntervalChanges(): void {
        this.datasetMap.forEach(dataset => {
            this.loadData(dataset);
        });
    }

    protected addDataset(id: string, url: string): void {
        this.api.getDataset(id, url).subscribe(dataset => {
            this.datasetMap.set(dataset.internalId, dataset);
            this.loadData(dataset);
        });
    }

    protected removeDataset(internalId: string): void {
        throw new Error('Method not implemented.');
    }

    protected setSelectedId(internalId: string): void {
        throw new Error('Method not implemented.');
    }

    protected removeSelectedId(internalId: string): void {
        throw new Error('Method not implemented.');
    }

    protected graphOptionsChanged(options: any): void {
        this.timeIntervalChanges();
    }

    protected datasetOptionsChanged(internalId: string, options: DatasetOptions, firstChange: boolean): void {
        if (this.datasetMap.has(internalId)) {
            this.loadData(this.datasetMap.get(internalId));
        }
    }

    protected onResize(): void {
        this.height = this.calculateHeight();
        this.width = this.calculateWidth();
        this.drawLineGraph();
    }

    private loadData(dataset: IDataset) {
        if (this.timespan && this.datasetOptions.has(dataset.internalId)) {
            const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, 0.2);
            const option = this.datasetOptions.get(dataset.internalId);
            this.api.getData<LocatedTimeValueEntry>(dataset.id, dataset.url, buffer,
                {
                    generalize: option.generalize
                })
                .subscribe(result => {
                    this.processData(result.values);
                    this.drawLineGraph();
                });
        }
    }

    private processData(data: Array<LocatedTimeValueEntry>) {
        this.internalValues = [];
        data.forEach((element, idx) => {
            const previous = this.internalValues.length > 0 ? this.internalValues[this.internalValues.length - 1] : null;
            const entry = this.createDataEntry(element, previous, idx);
            // if (this.selection) {
            //     if (idx >= this.selection.from && idx <= this.selection.to) {
            //         this.internalValues.push(entry);
            //     }
            // } else {
            this.internalValues.push(entry);
            // }
        });
    }

    private createDataEntry(entry: LocatedTimeValueEntry, previous: DataEntry, index: number): DataEntry {
        const s = new L.LatLng(entry.geometry.coordinates[1], entry.geometry.coordinates[0]);
        let dist: number;
        if (previous) {
            const e = new L.LatLng(previous.geometry.coordinates[1], previous.geometry.coordinates[0]);
            const newdist = s.distanceTo(e);
            dist = previous.dist + Math.round(newdist / 1000 * 100000) / 100000;
        } else {
            dist = 0;
        }
        return {
            tick: index,
            dist: Math.round(dist * 10) / 10,
            timestamp: entry.timestamp,
            value: entry.value,
            x: entry.geometry.coordinates[0],
            y: entry.geometry.coordinates[1],
            latlng: s,
            geometry: entry.geometry
        };
    }

    private calcYValue = (d: DataEntry) => {
        return this.yScale(d.value);
    }

    private calcXValue = (d: DataEntry, i: number) => {
        const xDiagCoord = this.xScale(this.getXValue(d));
        d.xDiagCoord = xDiagCoord;
        return xDiagCoord;
    }

    private calculateHeight(): number {
        return this.rawSvg.node().clientHeight - this.margin.top - this.margin.bottom;
    }

    private calculateWidth(): number {
        return this.rawSvg.node().clientWidth - this.margin.left - this.margin.right - this.maxLabelwidth;
    }

    private getXValue(data: DataEntry) {
        switch (this.graphOptions.axisType) {
            case AxisType.Distance:
                return data.dist;
            case AxisType.Time:
                return data.timestamp;
            case AxisType.Ticks:
                return data.tick;
            default:
                return data.tick;
        }
    }

    private drawLineGraph() {
        if (!this.internalValues || this.internalValues.length === 0 || !this.graph) {
            return;
        }

        this.graph.selectAll('*').remove();

        this.drawYAxis();
        this.drawXAxis();

        if (this.graphOptions.dotted) {
            this.drawDots(this.internalValues);
        } else {
            this.drawValueLine(this.internalValues);
        }

        this.background = this.graph.append('rect')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('fill', 'none')
            .attr('stroke', 'none')
            .attr('pointer-events', 'all')
            .on('mousemove.focus', this.mousemoveHandler)
            .on('mouseout.focus', this.mouseoutHandler)
            .on('mousedown.drag', this.dragStartHandler)
            .on('mousemove.drag', this.dragHandler)
            .on('mouseup.drag', this.dragEndHandler);

        this.focusG = this.graph.append('g');
        this.highlightFocus = this.focusG.append('svg:line')
            .attr('class', 'mouse-focus-line')
            .attr('x2', '0')
            .attr('y2', '0')
            .attr('x1', '0')
            .attr('y1', '0');
        this.focuslabelValue = this.focusG.append('svg:text')
            .style('pointer-events', 'none')
            .attr('class', 'mouse-focus-label-x');
        this.focuslabelTime = this.focusG.append('svg:text')
            .style('pointer-events', 'none')
            .attr('class', 'mouse-focus-label-x');
        this.focuslabelY = this.focusG.append('svg:text')
            .style('pointer-events', 'none')
            .attr('class', 'mouse-focus-label-y');
    }

    private mousemoveHandler = () => {
        if (!this.internalValues || this.internalValues.length === 0) {
            return;
        }
        const coords = d3.mouse(this.background.node());
        const idx = this.getItemForX(coords[0], this.internalValues);
        // this.onHighlight.emit(this.internalValues[idx].tick); // TODO
    }

    private mouseoutHandler = () => {
        this.hideDiagramIndicator();
    }

    private dragStartHandler = () => {
        this.dragging = false;
        this.dragStart = d3.mouse(this.background.node());
    }

    private dragHandler = () => {
        this.dragging = true;
        this.drawDragRectangle();
    }

    private dragEndHandler = () => {
        if (!this.dragStart || !this.dragging) {
            // this.onSelection.emit({ from: 0, to: this.data.length }); // TODO
            this.dragStart = null;
            this.dragging = false;
        } else {
            const from = this.getItemForX(this.dragStart[0], this.internalValues);
            const to = this.getItemForX(this.dragCurrent[0], this.internalValues);
            // this.onSelection.emit({ from: this.internalValues[from].tick, to: this.internalValues[to].tick }); // TODO
            this.dragStart = null;
            this.dragging = false;
        }
        this.resetDrag();
    }

    private drawDragRectangle() {
        if (!this.dragStart) {
            return;
        }

        this.dragCurrent = d3.mouse(this.background.node());

        const x1 = Math.min(this.dragStart[0], this.dragCurrent[0]);
        const x2 = Math.max(this.dragStart[0], this.dragCurrent[0]);

        if (!this.dragRect && !this.dragRectG) {

            this.dragRectG = this.graph.append('g');

            this.dragRect = this.dragRectG.append('rect')
                .attr('width', x2 - x1)
                .attr('height', this.height)
                .attr('x', x1)
                .attr('class', 'mouse-drag')
                .style('pointer-events', 'none');
        } else {
            this.dragRect.attr('width', x2 - x1)
                .attr('x', x1);
        }
    }

    private resetDrag() {
        if (this.dragRectG) {
            this.dragRectG.remove();
            this.dragRectG = null;
            this.dragRect = null;
        }
    }


    private hideDiagramIndicator() {
        this.focusG.style('visibility', 'hidden');
    }

    private showDiagramIndicator = (idx: number) => {
        const item = this.internalValues[idx];
        this.focusG.style('visibility', 'visible');
        this.highlightFocus.attr('x1', item.xDiagCoord)
            .attr('y1', 0)
            .attr('x2', item.xDiagCoord)
            .attr('y2', this.height)
            .classed('hidden', false);

        const alt = item.value;
        const numY = alt;

        this.focuslabelValue
            .attr('x', item.xDiagCoord + 2)
            .attr('y', 13);
        // .text(numY + this.dataset.uom); // TODO
        this.focuslabelTime
            .attr('x', item.xDiagCoord - 95)
            .attr('y', 13)
            .text(moment(item.timestamp).format('DD.MM.YY HH:mm'));
        if (this.graphOptions.axisType === AxisType.Distance) {
            this.focuslabelY
                .attr('y', this.height - 5)
                .attr('x', item.xDiagCoord + 2)
                .text(item.dist + ' km');
        }
        if (this.graphOptions.axisType === AxisType.Ticks) {
            this.focuslabelY
                .attr('y', this.height - 5)
                .attr('x', item.xDiagCoord + 2)
                .text('Measurement: ' + item.tick);
        }
    }

    private getItemForX(x: number, data: Array<DataEntry>) {
        const index = this.xScale.invert(x);
        const bisectDate = d3.bisector((d: DataEntry) => {
            switch (this.graphOptions.axisType) {
                case AxisType.Distance:
                    return d.dist;
                case AxisType.Time:
                    return d.timestamp;
                case AxisType.Ticks:
                default:
                    return d.tick;
            }
        }).left;
        return bisectDate(this.internalValues, index);
    }

    private drawYAxis() {
        const range = d3.extent<LocatedTimeValueEntry, number>(this.internalValues, (datum, index, array) => {
            return datum.value;
        });
        const rangeOffset = (range[1] - range[0]) * 0.10;
        this.yScale = d3.scaleLinear()
            .domain([range[0] - rangeOffset, range[1] + rangeOffset])
            .range([this.height, 0]);

        this.yAxisGen = d3.axisLeft(this.yScale).ticks(5);

        // draw y axis
        this.graph.append('svg:g')
            .attr('class', 'y axis')
            .call(this.yAxisGen);

        // calculate
        // const labels = d3.select('.y.axis').selectAll('text');
        // if (labels instanceof Array && labels.length === 1) {
        //     this.maxLabelwidth = 0;
        //     labels[0].forEach((elem) => {
        //         debugger;
        //         if (elem.getBBox().width > this.maxLabelwidth) {
        //             this.maxLabelwidth = elem.getBBox().width;
        //         }
        //     });
        //     this.graph.attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');
        // }

        // draw y axis label
        this.graph.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - this.margin.left - this.maxLabelwidth)
            .attr('x', 0 - (this.height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle');
        // .text(this.dataset.uom); // TODO

        // draw the y grid lines
        this.graph.append('svg:g')
            .attr('class', 'grid')
            .call(this.makeYAxis);

        // draw right axis as border
        this.graph.append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + this.width + ', 0)')
            .call(d3.axisRight(this.yScale).tickSize(0).ticks(0));
    }

    private drawXAxis() {
        this.xScale = d3.scaleLinear()
            .domain(this.getXDomain(this.internalValues))
            .range([0, this.width]);
        this.xAxisGen = d3.axisBottom(this.xScale).ticks(5);

        if (this.graphOptions.axisType === AxisType.Time) {
            this.xAxisGen.tickFormat((d) => {
                return d3.timeFormat('%d.%m.%Y %H:%M:%S')(new Date(d.valueOf()));
            });
        }

        // draw x axis
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.xAxisGen);

        // draw the x grid lines
        this.graph.append('svg:g')
            .attr('class', 'grid')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.makeXAxis);

        // draw upper axis as border
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .call(d3.axisTop(this.xScale).ticks(0).tickSize(0));

        this.graph.append('text') // text label for the x axis
            .attr('x', this.width / 2)
            .attr('y', this.height + this.margin.bottom - 5)
            .style('text-anchor', 'middle')
            .text(this.getXAxisLabel());
    }

    private drawDots(values: Array<DataEntry>) {
        // draw dots
        this.graph.selectAll('dot')
            .data(values)
            .enter().append('circle')
            .attr('stroke', 'blue')
            .attr('r', 1.5)
            .attr('cx', this.calcXValue)
            .attr('cy', this.calcYValue);
    }

    private drawValueLine(values: Array<DataEntry>) {
        // draw the value line
        this.graph.append('path')
            .datum(values)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 1)
            .attr('d', this.lineFun);

        // draw filled area
        this.graph.append('path')
            .datum(values)
            .attr('d', this.area)
            .attr('class', 'graphArea');
    }

    private makeXAxis = () => {
        return d3.axisBottom(this.xScale)
            .ticks(10)
            .tickSize(-this.height)
            .tickFormat();
    }

    private makeYAxis = () => {
        return d3.axisLeft(this.yScale)
            .ticks(5)
            .tickSize(-this.width)
            .tickFormat();
    }

    private getXDomain(values: Array<DataEntry>) {
        switch (this.graphOptions.axisType) {
            case AxisType.Distance:
                return [values[0].dist, values[values.length - 1].dist];
            case AxisType.Time:
                return [values[0].timestamp, values[values.length - 1].timestamp];
            default:
                return [values[0].tick, values[values.length - 1].tick];
        }
    }

    private getXAxisLabel() {
        switch (this.graphOptions.axisType) {
            case AxisType.Distance:
                return 'Distance';
            case AxisType.Time:
                return 'Time';
            default:
                return 'Ticks';
        }
    }

}
