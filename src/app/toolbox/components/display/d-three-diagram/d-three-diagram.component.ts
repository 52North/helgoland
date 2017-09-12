import {
    AfterViewInit,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';
import * as L from 'leaflet';
import * as moment from 'moment';

import { LocatedTimeValueEntry } from './../../../model/api/data';

export class SelectionRange {
    from: number;
    to: number;
}

@Component({
    selector: 'n52-d-three-diagram',
    templateUrl: './d-three-diagram.component.html',
    styleUrls: ['./d-three-diagram.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DThreeDiagramComponent implements AfterViewInit, OnChanges {

    @Input()
    public data;

    @Input()
    public dataset;

    @Input()
    public dotted: boolean;

    @Input()
    public axisType: string;

    @Input()
    public selection: SelectionRange;

    @Input()
    public highlight: number;

    @Output()
    public onSelection: EventEmitter<SelectionRange> = new EventEmitter();

    @Output()
    public onHighlight: EventEmitter<number> = new EventEmitter();

    private margin = {
        top: 10,
        right: 20,
        bottom: 40,
        left: 10
    };
    private internalValues: Array<DataEntry> = [];
    private background;
    private pathClass = 'path';
    private xScale;
    private yScale;
    private focusG;
    private highlightFocus;
    private focuslabelValue;
    private focuslabelTime;
    private focuslabelY;
    private dragging;
    private dragStart;
    private dragCurrent;
    private dragRect;
    private dragRectG;
    private maxLabelwidth = 0;
    private rawSvg;
    private graph;
    private xAxisGen;
    private yAxisGen;
    private lineFun;
    private area;

    @ViewChild('dthree') d3Elem;

    public ngAfterViewInit() {
        const wrapper = d3.select(this.d3Elem.nativeElement);

        this.rawSvg = wrapper.append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.graph = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.lineFun = d3.svg.line()
            .x(this.calcXValue)
            .y(this.calcYValue)
            .interpolate('linear');

        this.area = d3.svg.area()
            .x(this.calcXValue)
            .y0(this.height)
            .y1(this.calcYValue)
            .interpolate('linear');

        this.drawLineChart();
    }

    private calcYValue = (d) => {
        return this.yScale(d.value);
    }

    private calcXValue = (d, i) => {
        const xDiagCoord = this.xScale(this.getXValue(d));
        d.xDiagCoord = xDiagCoord;
        return xDiagCoord;
    }

    private height() {
        return this.rawSvg[0][0].clientHeight - this.margin.top - this.margin.bottom;
    }

    private width() {
        return this.rawSvg[0][0].clientWidth - this.margin.left - this.maxLabelwidth - this.margin.right;
    }

    private getXDomain(values: Array<DataEntry>) {
        switch (this.axisType) {
            case 'distance':
                return [values[0].dist, values[values.length - 1].dist];
            case 'time':
                return [values[0].timestamp, values[values.length - 1].timestamp];
            default:
                return [values[0].tick, values[values.length - 1].tick];
        }
    }

    private drawValueLine(values: Array<DataEntry>) {
        // draw the value line
        this.graph.append('svg:path')
            .attr({
                'd': this.lineFun(values),
                'stroke': 'blue',
                'stroke-width': 1,
                'fill': 'none',
                'class': this.pathClass
            });
        // draw filled area
        // this.graph.append('svg:path')
        //     .datum(values)
        //     .attr({
        //         d: this.area,
        //         class: 'graphArea'
        //     });
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

    private processData() {
        this.internalValues = [];
        this.data.dist = 0;
        this.data.forEach((element, idx) => {
            const entry = this.createDataEntry(element, this.data[idx ? idx - 1 : 0], idx);
            if (this.selection) {
                if (idx >= this.selection.from && idx <= this.selection.to) {
                    this.internalValues.push(entry);
                }
            } else {
                this.internalValues.push(entry);
            }
        });
    }

    private createDataEntry(entry: LocatedTimeValueEntry, previous: LocatedTimeValueEntry, index: number): DataEntry {
        const s = new L.LatLng(entry.geometry.coordinates[1], entry.geometry.coordinates[0]);
        const e = new L.LatLng(previous.geometry.coordinates[1], previous.geometry.coordinates[0]);
        const newdist = s.distanceTo(e);
        this.data.dist = this.data.dist + Math.round(newdist / 1000 * 100000) / 100000;
        return {
            tick: index,
            dist: Math.round(this.data.dist * 10) / 10,
            timestamp: entry.timestamp,
            value: entry.value,
            x: entry.geometry.coordinates[0],
            y: entry.geometry.coordinates[1],
            latlng: s,
            geometry: entry.geometry
        };
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.data && this.data) {
            this.processData();
            this.drawLineChart();
        }
        if (changes.selection && this.selection && this.data) {
            this.processData();
            this.drawLineChart();
        }
        if (changes.highlight && this.highlight) {
            const idx = this.internalValues.findIndex((entry) => {
                return entry.tick === this.highlight;
            });
            this.showDiagramIndicator(idx);
        }
        if (changes.axisType && this.axisType && this.data) {
            this.drawLineChart();
        }
        if (changes.dotted && this.data) {
            this.drawLineChart();
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.drawLineChart();
    }

    private getXValue(data: DataEntry) {
        switch (this.axisType) {
            case 'distance':
                return data.dist;
            case 'time':
                return data.timestamp;
            case 'ticks':
                return data.tick;
            default:
                return data.tick;
        }
    }

    private makeXAxis = () => {
        return d3.svg.axis()
            .scale(this.xScale)
            .orient('bottom')
            .ticks(10);
    }

    private makeYAxis = () => {
        return d3.svg.axis()
            .scale(this.yScale)
            .orient('left')
            .ticks(5);
    }

    private getXAxisLabel() {
        switch (this.axisType) {
            case 'distance':
                return 'Distance';
            case 'time':
                return 'Time';
            default:
                return 'Ticks';
        }
    }

    private drawXAxis() {
        this.xScale = d3.scale.linear()
            .domain(this.getXDomain(this.internalValues))
            .range([0, this.width()]);
        this.xAxisGen = d3.svg.axis()
            .scale(this.xScale)
            .orient('bottom')
            .ticks(5);
        if (this.axisType === 'time') {
            this.xAxisGen.tickFormat((d) => {
                return d3.time.format('%d.%m.%Y %H:%M:%S')(new Date(d));
            });
        }

        // draw x axis
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height() + ')')
            .call(this.xAxisGen);

        // draw the x grid lines
        this.graph.append('svg:g')
            .attr('class', 'grid')
            .attr('transform', 'translate(0,' + this.height() + ')')
            .call(this.makeXAxis().tickSize(-this.height(), 0).tickFormat(''));

        // draw upper axis as border
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .call(d3.svg.axis()
                .scale(this.xScale)
                .orient('top')
                .tickSize(0)
                .tickFormat(''));

        this.graph.append('text') // text label for the x axis
            .attr('x', this.width() / 2)
            .attr('y', this.height() + this.margin.bottom - 5)
            .style('text-anchor', 'middle')
            .text(this.getXAxisLabel());
    }

    private drawYAxis() {
        const range = d3.extent<LocatedTimeValueEntry>(this.internalValues, (d) => d.value);
        const rangeOffset = (range[1] - range[0]) * 0.10;
        this.yScale = d3.scale.linear()
            .domain([range[0] - rangeOffset, range[1] + rangeOffset])
            .range([this.height(), 0]);

        this.yAxisGen = d3.svg.axis()
            .scale(this.yScale)
            .orient('left')
            .ticks(5);

        // draw y axis
        this.graph.append('svg:g')
            .attr('class', 'y axis')
            .call(this.yAxisGen);

        // calculate
        const labels = d3.select('.y.axis').selectAll('text');
        if (labels instanceof Array && labels.length === 1) {
            this.maxLabelwidth = 0;
            labels[0].forEach((elem) => {
                if (elem.getBBox().width > this.maxLabelwidth) {
                    this.maxLabelwidth = elem.getBBox().width;
                }
            });
            this.graph.attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');
        }

        // draw y axis label
        this.graph.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - this.margin.left - this.maxLabelwidth)
            .attr('x', 0 - (this.height() / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text(this.dataset.uom);

        // draw the y grid lines
        this.graph.append('svg:g')
            .attr('class', 'grid')
            .call(this.makeYAxis().tickSize(-this.width(), 0).tickFormat(''));

        // draw right axis as border
        this.graph.append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + this.width() + ', 0)')
            .call(d3.svg.axis()
                .scale(this.yScale)
                .orient('right')
                .tickSize(0)
                .tickFormat(''));
    }

    private drawLineChart() {
        if (!this.internalValues || this.internalValues.length === 0 || !this.graph) {
            return;
        }

        this.graph.selectAll('*').remove();

        this.drawYAxis();
        this.drawXAxis();

        if (this.dotted) {
            this.drawDots(this.internalValues);
        } else {
            this.drawValueLine(this.internalValues);
        }

        this.background = this.graph.append('svg:rect')
            .attr({
                'width': this.width(),
                'height': this.height(),
                'fill': 'none',
                'stroke': 'none',
                'pointer-events': 'all'
            })
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
        this.onHighlight.emit(this.internalValues[idx].tick);
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
            this.onSelection.emit({ from: 0, to: this.data.length });
            this.dragStart = null;
            this.dragging = false;
        } else {
            const from = this.getItemForX(this.dragStart[0], this.internalValues);
            const to = this.getItemForX(this.dragCurrent[0], this.internalValues);
            this.onSelection.emit({ from: this.internalValues[from].tick, to: this.internalValues[to].tick });
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
                .attr('height', this.height())
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

    private getItemForX(x: number, data: Array<DataEntry>) {
        const index = this.xScale.invert(x);
        const bisectDate = d3.bisector((d) => {
            switch (this.axisType) {
                case 'distance':
                    // TODO fix
                    return d['dist'];
                case 'time':
                    return d['timestamp'];
                case 'ticks':
                default:
                    return d['tick'];
            }
        }).left;
        return bisectDate(this.internalValues, index);
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
            .attr('y2', this.height())
            .classed('hidden', false);

        const alt = item.value;
        const numY = alt;

        this.focuslabelValue
            .attr('x', item.xDiagCoord + 2)
            .attr('y', 13)
            .text(numY + this.dataset.uom);
        this.focuslabelTime
            .attr('x', item.xDiagCoord - 95)
            .attr('y', 13)
            .text(moment(item.timestamp).format('DD.MM.YY HH:mm'));
        if (this.axisType === 'distance') {
            this.focuslabelY
                .attr('y', this.height() - 5)
                .attr('x', item.xDiagCoord + 2)
                .text(item.dist + ' km');
        }
        if (this.axisType === 'ticks') {
            this.focuslabelY
                .attr('y', this.height() - 5)
                .attr('x', item.xDiagCoord + 2)
                .text('Measurement: ' + item.tick);
        }
    }
}

interface DataEntry extends LocatedTimeValueEntry {
    dist: number;
    tick: number;
    x: number;
    y: number;
    xDiagCoord?: number;
    latlng: L.LatLng;
}
