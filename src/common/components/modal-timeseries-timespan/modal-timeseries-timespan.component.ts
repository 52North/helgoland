import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Timespan } from '@helgoland/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'n52-modal-timeseries-timespan',
  templateUrl: './modal-timeseries-timespan.component.html',
  styleUrls: ['./modal-timeseries-timespan.component.scss']
})
export class ModalTimeseriesTimespanComponent {

  @Input()
  public timespan: Timespan;

  @Output()
  public timespanChanged: EventEmitter<Timespan> = new EventEmitter();

  public tempTimespan: Timespan;
  public tempTimespanIsValid: boolean;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  public cancel() {
    this.activeModal.dismiss();
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
    this.timespanChanged.emit(this.timespan);
    this.cancel();
  }

}
