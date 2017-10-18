import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatasetOptions, Time, TimeInterval, Timespan } from 'helgoland-toolbox';

@Component({
    selector: 'n52-flot-overview-timeseries-graph',
    templateUrl: './flot-overview-timeseries-graph.component.html',
    styleUrls: ['./flot-overview-timeseries-graph.component.scss']
})
export class FlotOverviewTimeseriesGraphComponent implements OnInit, OnChanges {

    @Input()
    public datasetIds: Array<string>;

    @Input()
    public datasetOptions: Map<string, DatasetOptions>;

    @Input()
    public graphOptions: any;

    @Input()
    public timeInterval: TimeInterval;

    @Input()
    public rangefactor: number;

    @Output()
    public onTimespanChanged: EventEmitter<Timespan> = new EventEmitter();

    public overviewTimespan: Timespan;
    private init = false;

    constructor(
        private timeSrvc: Time
    ) { }

    public ngOnInit() {
        this.rangefactor = this.rangefactor || 1;
        this.calculateOverviewRange();
        this.init = true;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.timeInterval && this.init) {
            this.calculateOverviewRange();
        }
    }

    public timeChanged(timespan: Timespan) {
        this.onTimespanChanged.emit(timespan);
    }

    private calculateOverviewRange() {
        const timespan = this.timeSrvc.createTimespanOfInterval(this.timeInterval);
        this.overviewTimespan = this.timeSrvc.getBufferedTimespan(timespan, this.rangefactor);
        this.graphOptions.selection.range = {
            from: timespan.from,
            to: timespan.to
        };
        this.datasetOptions.forEach(e => e.generalize = true);
    }
}
