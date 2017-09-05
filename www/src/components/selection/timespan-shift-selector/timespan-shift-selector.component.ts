import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    public onTimespanChange: EventEmitter<Timespan> = new EventEmitter<Timespan>();

    public tempTimespan: Timespan;

    constructor(
        private timeSrvc: Time,
        private modalService: NgbModal
    ) { }

    public ngOnInit() {
    }

    public back() {
        this.onTimespanChange.emit(this.timeSrvc.stepBack(this.timespan));
    }

    public forward() {
        this.onTimespanChange.emit(this.timeSrvc.stepForward(this.timespan));
    }

    public open(content) {
        this.tempTimespan = new Timespan(this.timespan.from, this.timespan.to);
        this.modalService.open(content, {size: 'lg'});
    }

    public noteChangedTimespan(newValue) {
        this.tempTimespan = newValue;
    }

    public applyNewTimespan() {
        this.timespan = this.tempTimespan;
        this.onTimespanChange.emit(this.timespan);
    }

}
