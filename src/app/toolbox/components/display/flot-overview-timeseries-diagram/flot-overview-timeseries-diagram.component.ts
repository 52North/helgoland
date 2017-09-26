import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { DatasetOptions } from './../../../model/api/dataset/options';
import { TimeInterval, Timespan } from './../../../model/internal/time-interval';
import { Time } from './../../../services/time/time.service';

@Component({
    selector: 'n52-flot-overview-timeseries-diagram',
    templateUrl: './flot-overview-timeseries-diagram.component.html',
    styleUrls: ['./flot-overview-timeseries-diagram.component.scss']
})
export class FlotOverviewTimeseriesDiagramComponent implements OnInit, OnChanges {

    @Input()
    public seriesIds: Array<string>;

    @Input()
    public seriesOptions: Map<string, DatasetOptions>;

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
            from: timespan.from.getTime(),
            to: timespan.to.getTime()
        };
        this.seriesOptions.forEach(e => e.generalize = true);
    }
}
