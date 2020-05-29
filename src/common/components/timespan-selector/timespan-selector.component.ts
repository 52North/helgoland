import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Timespan, TimezoneService } from '@helgoland/core';
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
  public timespanChange: EventEmitter<Timespan> = new EventEmitter<Timespan>();

  @Output()
  public invalidTimespanSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  public dateFrom: NgbDateStruct;
  public timeFrom: NgbTimeStruct;
  public dateTo: NgbDateStruct;
  public timeTo: NgbTimeStruct;
  public isValidTimespan: boolean;

  constructor(
    private timezoneSrvc: TimezoneService
  ) { }

  public ngOnInit() {
    const start = this.timezoneSrvc.createTzDate(this.timespan.from);
    const end = this.timezoneSrvc.createTzDate(this.timespan.to);

    this.isValidTimespan = start.isBefore(end);

    this.dateFrom = {
      year: start.year(), month: start.month() + 1, day: start.date()
    };
    this.timeFrom = {
      hour: start.hour(), minute: start.minute(), second: start.second()
    };
    this.dateTo = {
      year: end.year(), month: end.month() + 1, day: end.date()
    };
    this.timeTo = {
      hour: end.hour(), minute: end.minute(), second: end.minute()
    };
  }

  public timespanChanged() {

    const start = this.timezoneSrvc.createTzDate({
      year: this.dateFrom.year,
      month: this.dateFrom.month - 1,
      date: this.dateFrom.day,
      hour: this.timeFrom.hour,
      minute: this.timeFrom.minute,
      second: this.timeFrom.second
    });

    const end = this.timezoneSrvc.createTzDate({
      year: this.dateTo.year,
      month: this.dateTo.month - 1,
      date: this.dateTo.day,
      hour: this.timeTo.hour,
      minute: this.timeTo.minute,
      second: this.timeTo.second
    });
    console.log(`start: ${start.format('L LT z')}`);
    console.log(`end: ${end.format('L LT z')}`);

    this.isValidTimespan = start.isBefore(end);

    if (this.isValidTimespan) {
      this.timespan = new Timespan(start.toDate(), end.toDate());
      this.timespanChange.emit(this.timespan);
      console.log(this.timespan);
    } else {
      this.invalidTimespanSelected.emit(true);
      console.log('Invalid timespan selected!');
    }
  }

}
