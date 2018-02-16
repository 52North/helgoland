import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Timespan } from '@helgoland/core';
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

  public ngOnInit() {
    const from = new Date(this.timespan.from);
    const to = new Date(this.timespan.to);
    this.dateFrom = {
      year: from.getFullYear(), month: from.getMonth() + 1, day: from.getDate()
    };
    this.timeFrom = {
      hour: from.getHours(), minute: from.getMinutes(), second: from.getSeconds()
    };
    this.dateTo = {
      year: to.getFullYear(), month: to.getMonth() + 1, day: to.getDate()
    };
    this.timeTo = {
      hour: to.getHours(), minute: to.getMinutes(), second: to.getSeconds()
    };
  }

  public timespanChanged() {
    const dateTimeFrom = new Date(this.dateFrom.year, this.dateFrom.month - 1, this.dateFrom.day,
      this.timeFrom.hour, this.timeFrom.minute, this.timeFrom.second);
    const dateTimeTo = new Date(this.dateTo.year, this.dateTo.month - 1, this.dateTo.day,
      this.timeTo.hour, this.timeTo.minute, this.timeTo.second);

    this.isValidTimespan = (dateTimeFrom < dateTimeTo);

    if (this.isValidTimespan) {
      this.timespan = new Timespan(dateTimeFrom.getTime(), dateTimeTo.getTime());
      this.onTimespanChange.emit(this.timespan);
      console.log(this.timespan);
    } else {
      this.onInvalidTimespanSelected.emit(true);
      console.log('Invalid timespan selected!');
    }
  }

}
