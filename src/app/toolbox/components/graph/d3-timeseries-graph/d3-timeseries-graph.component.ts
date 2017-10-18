import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    IterableDiffers,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';
import { ApiInterface, DatasetOptions, IDataset, InternalIdHandler, LocatedTimeValueEntry, Time } from 'helgoland-toolbox';
import * as L from 'leaflet';
import * as moment from 'moment';

import { DatasetGraphComponent } from '../datasetGraphComponent';

interface DataEntry extends LocatedTimeValueEntry {
    dist: number;
    tick: number;
    x: number;
    y: number;
    xDiagCoord?: number;
    latlng: L.LatLng;
    [id: string]: any;
}

interface DatasetConstellation {
    dataset?: IDataset;
    data?: Array<LocatedTimeValueEntry>;
    yScale?: d3.ScaleLinear<number, number>;
    drawOptions?: DrawOptions;
    focusLabelRect?: any;
    focusLabel?: any;
}

interface DrawOptions {
    uom: string;
    id: string;
    color: string;
    first: boolean;
    offset: number;
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

export class SelectionRange {
    from: number;
    to: number;
}

@Component({
    selector: 'n52-d3-timeseries-graph',
    templateUrl: './d3-timeseries-graph.component.html',
    styleUrls: ['./d3-timeseries-graph.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class D3TimeseriesGraphComponent extends DatasetGraphComponent<DatasetOptions, D3GraphOptions> implements AfterViewInit, OnChanges {

    private datasetMap: Map<string, DatasetConstellation> = new Map();

    @Input()
    public selection: SelectionRange;

    @Output()
    public onSelectionChangedFinished: EventEmitter<SelectionRange> = new EventEmitter();

    @Output()
    public onSelectionChanged: EventEmitter<SelectionRange> = new EventEmitter();

    @Output()
    public onHoverHighlight: EventEmitter<number> = new EventEmitter();

    @ViewChild('dthree') d3Elem: ElementRef;

    private rawSvg: any;
    private graph: any;
    private height: number;
    private width: number;
    private margin = {
        top: 10,
        right: 10,
        bottom: 40,
        left: 40
    };
    private maxLabelwidth = 0;
    private lineFun: d3.Line<DataEntry>;
    private area: d3.Area<DataEntry>;
    private xScaleBase: d3.ScaleLinear<number, number>;
    private yScaleBase: d3.ScaleLinear<number, number>;
    private background: any;
    private focusG: any;
    private highlightFocus: any;
    private focuslabelTime: any;
    private focuslabelY: any;
    private yAxisGen: d3.Axis<number | { valueOf(): number; }>;
    private baseValues: Array<DataEntry> = [];
    private dragging: boolean;
    private dragStart: [number, number];
    private dragCurrent: [number, number];
    private dragRect: any;
    private dragRectG: any;
    private bufferSum: number;
    private dataLength: number;

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

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (changes.selection && this.selection) {
            this.processAllData();
            this.drawLineGraph();
        }
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
        this.datasetMap.forEach(entry => {
            if (entry.dataset) {
                this.loadData(entry.dataset);
            }
        });
    }

    protected addDataset(id: string, url: string): void {
        this.api.getDataset(id, url).subscribe(dataset => {
            this.datasetMap.set(dataset.internalId, { dataset });
            this.loadData(dataset);
        });
    }

    protected removeDataset(internalId: string): void {
        this.datasetMap.delete(internalId);
        this.processAllData();
        this.drawLineGraph();
    }

    protected setSelectedId(internalId: string): void {
        throw new Error('Method not implemented.');
    }

    protected removeSelectedId(internalId: string): void {
        throw new Error('Method not implemented.');
    }

    protected graphOptionsChanged(options: D3GraphOptions): void {
        this.timeIntervalChanges();
    }

    protected datasetOptionsChanged(internalId: string, options: DatasetOptions, firstChange: boolean): void {
        if (this.datasetMap.has(internalId)) {
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
                    this.dataLength = result.values.length;
                    this.datasetMap.get(dataset.internalId).data = result.values;
                    this.processDataForId(dataset.internalId);
                    this.drawLineGraph();
                });
        }
    }

    private processAllData() {
        this.baseValues = [];
        this.datasetIds.forEach(id => this.processDataForId(id));
    }

    private processDataForId(internalId: string) {
        const datasetEntry = this.datasetMap.get(internalId);
        const firstEntry = this.baseValues.length === 0;
        let previous: DataEntry = null;
        datasetEntry.data.forEach((elem, idx) => {
            if (firstEntry) {
                const entry = this.createDataEntry(internalId, elem, previous, idx);
                if (this.selection) {
                    if (idx >= this.selection.from && idx <= this.selection.to) {
                        this.baseValues.push(entry);
                    }
                } else {
                    this.baseValues.push(entry);
                }
                previous = entry;
            } else {
                if (this.selection) {
                    if (idx >= this.selection.from && idx <= this.selection.to) {
                        this.baseValues[idx - this.selection.from][internalId] = elem.value;
                    }
                } else {
                    this.baseValues[idx][internalId] = elem.value;
                }
            }
        });
    }

    private createDataEntry(internalId: string, entry: LocatedTimeValueEntry, previous: DataEntry, index: number): DataEntry {
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
            [internalId]: entry.value,
            x: entry.geometry.coordinates[0],
            y: entry.geometry.coordinates[1],
            latlng: s,
            geometry: entry.geometry
        };
    }

    private calcYValue = (d: DataEntry) => {
        return this.yScaleBase(d.value);
    }

    private calcXValue = (d: DataEntry, i: number) => {
        const xDiagCoord = this.xScaleBase(this.getXValue(d));
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

    private drawDots(values: DataEntry[], yScale: d3.ScaleLinear<number, number>, options: DrawOptions) {
        this.graph.selectAll('dot')
            .data(values)
            .enter().append('circle')
            .attr('stroke', options.color)
            .attr('r', 1.5)
            .attr('fill', options.color)
            .attr('cx', this.calcXValue)
            .attr('cy', (d: DataEntry) => yScale(d[options.id]));
    }

    private drawValueLine(values: DataEntry[], yScale: d3.ScaleLinear<number, number>, options: DrawOptions) {
        this.graph.append('svg:path')
            .datum(values)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', options.color)
            .attr('stroke-width', 1)
            .attr('d', d3.line<DataEntry>()
                .x(this.calcXValue)
                .y((d: DataEntry) => yScale(d[options.id]))
                .curve(d3.curveLinear));
    }

    private drawGraph(yScale: d3.ScaleLinear<number, number>, options: DrawOptions) {
        if (this.graphOptions.dotted) {
            this.drawDots(this.baseValues, yScale, options);
        } else {
            this.drawValueLine(this.baseValues, yScale, options);
        }
    }

    private drawLineGraph() {
        if (!this.baseValues || this.baseValues.length === 0 || !this.graph) {
            return;
        }

        this.graph.selectAll('*').remove();

        this.bufferSum = 0;

        this.yScaleBase = null;

        this.datasetMap.forEach((datasetEntry, id) => {
            if (this.datasetOptions.has(id) && datasetEntry.data) {
                datasetEntry.drawOptions = {
                    uom: datasetEntry.dataset.uom,
                    id: datasetEntry.dataset.internalId,
                    color: this.datasetOptions.get(id).color,
                    first: this.yScaleBase === null,
                    offset: this.bufferSum
                };
                const axisResult = this.drawYAxis(datasetEntry.drawOptions);
                if (this.yScaleBase === null) {
                    this.yScaleBase = axisResult.yScale;
                } else {
                    this.bufferSum = axisResult.buffer;
                }
                datasetEntry.yScale = axisResult.yScale;
            }
        });

        // draw right axis as border
        this.graph.append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + this.width + ', 0)')
            .call(d3.axisRight(this.yScaleBase).tickSize(0).ticks(0));

        this.drawXAxis(this.bufferSum);

        this.datasetMap.forEach((entry, id) => {
            if (this.datasetOptions.has(id) && entry.data) {
                this.drawGraph(entry.yScale, entry.drawOptions);
            }
        });

        this.background = this.graph.append('svg:rect')
            .attr('width', this.width - this.bufferSum)
            .attr('height', this.height)
            .attr('fill', 'none')
            .attr('stroke', 'none')
            .attr('pointer-events', 'all')
            .attr('transform', 'translate(' + this.bufferSum + ', 0)')
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
            .attr('y1', '0')
            .style('stroke', 'black')
            .style('stroke-width', '1px');

        this.datasetMap.forEach((entry, id) => {
            if (this.datasetOptions.has(id) && entry.data) {
                entry.focusLabelRect = this.focusG.append('svg:rect')
                    .style('fill', 'white')
                    .style('stroke', 'none')
                    .style('pointer-events', 'none');
                entry.focusLabel = this.focusG.append('svg:text').attr('class', 'mouse-focus-label-x')
                    .style('pointer-events', 'none')
                    .style('fill', this.datasetOptions.get(id).color)
                    .style('font-weight', 'lighter');
            }
        });

        this.focuslabelTime = this.focusG.append('svg:text')
            .style('pointer-events', 'none')
            .attr('class', 'mouse-focus-label-x');
        this.focuslabelY = this.focusG.append('svg:text')
            .style('pointer-events', 'none')
            .attr('class', 'mouse-focus-label-y');
    }

    private mousemoveHandler = () => {
        if (!this.baseValues || this.baseValues.length === 0) {
            return;
        }
        const coords = d3.mouse(this.background.node());
        const idx = this.getItemForX(coords[0] + this.bufferSum, this.baseValues);
        this.showDiagramIndicator(idx);
        this.onHoverHighlight.emit(this.baseValues[idx].tick);
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
            this.onSelectionChangedFinished.emit({ from: 0, to: this.dataLength });
        } else {
            const from = this.getItemForX(this.dragStart[0] + this.bufferSum, this.baseValues);
            const to = this.getItemForX(this.dragCurrent[0] + this.bufferSum, this.baseValues);
            this.onSelectionChangedFinished.emit(this.prepareRange(this.baseValues[from].tick, this.baseValues[to].tick));
        }
        this.dragStart = null;
        this.dragging = false;
        this.resetDrag();
    }

    private prepareRange(from: number, to: number): SelectionRange {
        if (from <= to) {
            return { from, to };
        }
        return { from: to, to: from };
    }

    private drawDragRectangle() {
        if (!this.dragStart) { return; }

        this.dragCurrent = d3.mouse(this.background.node());

        const from = this.getItemForX(this.dragStart[0] + this.bufferSum, this.baseValues);
        const to = this.getItemForX(this.dragCurrent[0] + this.bufferSum, this.baseValues);
        this.onSelectionChanged.emit(this.prepareRange(this.baseValues[from].tick, this.baseValues[to].tick));

        const x1 = Math.min(this.dragStart[0], this.dragCurrent[0]);
        const x2 = Math.max(this.dragStart[0], this.dragCurrent[0]);

        if (!this.dragRect && !this.dragRectG) {

            this.dragRectG = this.graph.append('g');

            this.dragRect = this.dragRectG.append('rect')
                .attr('width', x2 - x1)
                .attr('height', this.height)
                .attr('x', x1 + this.bufferSum)
                .attr('class', 'mouse-drag')
                .style('pointer-events', 'none');
        } else {
            this.dragRect.attr('width', x2 - x1)
                .attr('x', x1 + this.bufferSum);
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
        const item = this.baseValues[idx];
        this.focusG.style('visibility', 'visible');
        this.highlightFocus.attr('x1', item.xDiagCoord)
            .attr('y1', 0)
            .attr('x2', item.xDiagCoord)
            .attr('y2', this.height)
            .classed('hidden', false);

        let onLeftSide = false;
        if ((this.background.node().getBBox().width + this.bufferSum) / 2 > item.xDiagCoord) { onLeftSide = true; }

        this.showLabelValues(item, onLeftSide);
        this.showTimeIndicatorLabel(item, onLeftSide);
        this.showBottomIndicatorLabel(item, onLeftSide);
    }

    private showLabelValues(item: DataEntry, onLeftSide: boolean) {
        this.datasetMap.forEach((entry, id) => {
            entry.focusLabel.text(item[id] + (entry.dataset.uom ? entry.dataset.uom : ''));
            const entryX = onLeftSide ? item.xDiagCoord + 2 : item.xDiagCoord - this.getDimensions(entry.focusLabel.node()).w;
            entry.focusLabel
                .attr('x', entryX)
                .attr('y', entry.yScale(item[id]) + this.getDimensions(entry.focusLabel.node()).h - 3);
            entry.focusLabelRect
                .attr('x', entryX)
                .attr('y', entry.yScale(item[id]))
                .attr('width', this.getDimensions(entry.focusLabel.node()).w)
                .attr('height', this.getDimensions(entry.focusLabel.node()).h);
        });
    }

    private showTimeIndicatorLabel(item: DataEntry, onLeftSide: boolean) {
        this.focuslabelTime.text(moment(item.timestamp).format('DD.MM.YY HH:mm'));
        this.focuslabelTime
            .attr('x', onLeftSide ? item.xDiagCoord + 2 : item.xDiagCoord - this.getDimensions(this.focuslabelTime.node()).w)
            .attr('y', 13);
    }

    private showBottomIndicatorLabel(item: DataEntry, onLeftSide: boolean) {
        if (this.graphOptions.axisType === AxisType.Distance) {
            this.focuslabelY.text(item.dist + ' km');
        }
        if (this.graphOptions.axisType === AxisType.Ticks) {
            this.focuslabelY.text('Measurement: ' + item.tick);
        }
        this.focuslabelY
            .attr('y', this.calculateHeight() - 5)
            .attr('x', onLeftSide ? item.xDiagCoord + 2 : item.xDiagCoord - this.getDimensions(this.focuslabelY.node()).w);
    }

    private getDimensions(el: any) {
        let w = 0,
            h = 0;
        if (el) {
            const dimensions = el.getBBox();
            w = dimensions.width;
            h = dimensions.height;
        } else {
            console.log('error: getDimensions() ' + el + ' not found.');
        }
        return {
            w: w,
            h: h
        };
    }

    private getItemForX(x: number, data: Array<DataEntry>) {
        const index = this.xScaleBase.invert(x);
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
        return bisectDate(this.baseValues, index);
    }

    private drawYAxis(options: DrawOptions): any {
        const range = d3.extent<DataEntry, number>(this.baseValues, (datum, index, array) => {
            return datum[options.id]; // here with ID
        });
        const rangeOffset = (range[1] - range[0]) * 0.10;
        const yScale = d3.scaleLinear()
            .domain([range[0] - rangeOffset, range[1] + rangeOffset])
            .range([this.height, 0]);

        this.yAxisGen = d3.axisLeft(yScale).ticks(5);

        // draw y axis
        const axis = this.graph.append('svg:g')
            .attr('class', 'y axis')
            .call(this.yAxisGen);

        // draw y axis label
        const text = this.graph.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('fill', options.color)
            .text(options.uom);

        const axisWidth = axis.node().getBBox().width + 5 + this.getDimensions(text.node()).h;
        const buffer = options.offset + (axisWidth < 30 ? 30 : axisWidth);
        if (!options.first) {
            axis.attr('transform', 'translate(' + buffer + ', 0)');
        }

        const textOffset = !options.first ? buffer : options.offset;
        text.attr('y', 0 - this.margin.left - this.maxLabelwidth + textOffset)
            .attr('x', 0 - (this.height / 2));

        // draw the y grid lines when there is only one dataset
        if (this.datasetIds.length === 1) {
            this.graph.append('svg:g')
                .attr('class', 'grid')
                .call(d3.axisLeft(yScale)
                    .ticks(5)
                    .tickSize(-this.width)
                    .tickFormat(() => '')
                );
        }

        return {
            buffer: buffer,
            yScale: yScale
        };
    }

    private drawXAxis(buffer: number) {
        this.xScaleBase = d3.scaleLinear()
            .domain(this.getXDomain(this.baseValues))
            .range([buffer, this.width]);

        const xAxisGen = d3.axisBottom(this.xScaleBase).ticks(5);

        if (this.graphOptions.axisType === AxisType.Time) {
            xAxisGen.tickFormat((d) => {
                return d3.timeFormat('%d.%m.%Y %H:%M:%S')(new Date(d.valueOf()));
            });
        }

        // draw x axis
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(xAxisGen);

        // draw the x grid lines
        this.graph.append('svg:g')
            .attr('class', 'grid')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(this.xScaleBase)
                .ticks(10)
                .tickSize(-this.height)
                .tickFormat(() => '')
            );

        // draw upper axis as border
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .call(d3.axisTop(this.xScaleBase).ticks(0).tickSize(0));

        // text label for the x axis
        this.graph.append('text')
            .attr('x', (this.width + buffer) / 2)
            .attr('y', this.height + this.margin.bottom - 5)
            .style('text-anchor', 'middle')
            .text(this.getXAxisLabel());
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
