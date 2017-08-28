import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Timespan } from '../../../model';
import { Time } from '../../../services/time';

@Component({
    selector: 'n52-timespan-shift-selector',
    templateUrl: './timespan-shift-selector.component.html',
    styleUrls: ['./timespan-shift-selector.component.scss']
})
export class TimespanShiftSelectorComponent implements OnInit {

    @Input()
    public timespan: Timespan;

    @Output()
    public onTimespanChanges: EventEmitter<Timespan> = new EventEmitter<Timespan>();

    constructor(
        private timeSrvc: Time
    ) { }

    public ngOnInit() {
    }

    public back() {
        this.onTimespanChanges.emit(this.timeSrvc.stepBack(this.timespan));
    }

    public forward() {
        this.onTimespanChanges.emit(this.timeSrvc.stepForward(this.timespan));
    }

    public open() {
        // TODO open Modal window
        // TODO provide preseleable Timespans
        // TODO provide free selectable Timespan
    }

}
