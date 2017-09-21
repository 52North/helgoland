import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Timespan } from './../../../model/internal/time-interval';
import { Time } from './../../../services/time/time.service';

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

    @ViewChild('modalTimespanSelector')
    public modalTemplate: TemplateRef<any>;

    public tempTimespan: Timespan;
    public tempTimespanIsValid: boolean;

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

    public open() {
        this.tempTimespan = new Timespan(this.timespan.from, this.timespan.to);
        this.modalService.open(this.modalTemplate, {size: 'lg'});
    }

    public noteChangedTimespan(newValue: Timespan) {
        this.tempTimespan = newValue;
        this.tempTimespanIsValid = true;
    }

    public noteInvalidTimespan(newValue: Timespan) {
        this.tempTimespanIsValid = false;
    }

    public applyNewTimespan() {
        this.timespan = this.tempTimespan;
        this.onTimespanChange.emit(this.timespan);
    }

}
