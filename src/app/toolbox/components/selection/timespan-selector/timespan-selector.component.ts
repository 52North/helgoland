import { Timespan } from './../../../model/internal/timespan';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'n52-timespan-selector',
    templateUrl: './timespan-selector.component.html',
    styleUrls: ['./timespan-selector.component.scss']
})

export class TimespanSelectorComponent implements OnInit {
    @Input()
    public timespan: Timespan;

    @Output()
    public onTimespanChange: EventEmitter<Timespan> = new EventEmitter<Timespan>();
    @Output()
    public onInvalidTimespanSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

    public dateFrom: NgbDateStruct;
    public timeFrom: NgbTimeStruct;
    public dateTo: NgbDateStruct;
    public timeTo: NgbTimeStruct;
    public isValidTimespan: boolean;

    constructor() { }

    public ngOnInit() {
        this.dateFrom = {
            year: this.timespan.from.getFullYear(), month: this.timespan.from.getMonth() + 1, day: this.timespan.from.getDate()
        };
        this.timeFrom = {
            hour: this.timespan.from.getHours(), minute: this.timespan.from.getMinutes(), second: this.timespan.from.getSeconds()
        };
        this.dateTo = {
            year: this.timespan.to.getFullYear(), month: this.timespan.to.getMonth() + 1, day: this.timespan.to.getDate()
        };
        this.timeTo = {
            hour: this.timespan.to.getHours(), minute: this.timespan.to.getMinutes(), second: this.timespan.to.getSeconds()
        };
    }

    public timespanChanged() {
        const dateTimeFrom = new Date(this.dateFrom.year, this.dateFrom.month - 1, this.dateFrom.day,
            this.timeFrom.hour, this.timeFrom.minute, this.timeFrom.second);
        const dateTimeTo = new Date(this.dateTo.year, this.dateTo.month - 1, this.dateTo.day,
            this.timeTo.hour, this.timeTo.minute, this.timeTo.second);

        this.isValidTimespan = (dateTimeFrom < dateTimeTo);

        if (this.isValidTimespan) {
            this.timespan = new Timespan(dateTimeFrom, dateTimeTo);
            this.onTimespanChange.emit(this.timespan);
            console.log(this.timespan);
        } else {
            this.onInvalidTimespanSelected.emit(true);
            console.log('Invalid timespan selected!');
        }
    }
}
