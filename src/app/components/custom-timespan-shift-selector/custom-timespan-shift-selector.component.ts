import { Component } from '@angular/core';
import { Time, TimespanShiftSelectorComponent } from 'helgoland-toolbox';

@Component({
  selector: 'n52-custom-timespan-shift-selector',
  templateUrl: './custom-timespan-shift-selector.component.html',
  styleUrls: ['./custom-timespan-shift-selector.component.scss']
})
export class CustomTimespanShiftSelectorComponent extends TimespanShiftSelectorComponent {

  constructor(timeSrvc: Time) {
    super(timeSrvc);
  }

}
