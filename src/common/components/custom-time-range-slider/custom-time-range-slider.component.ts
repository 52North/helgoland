import { Component, ViewEncapsulation } from '@angular/core';
import { TimeRangeSliderComponent } from '@helgoland/time-range-slider';

@Component({
  selector: 'n52-custom-time-range-slider',
  templateUrl: './custom-time-range-slider.component.html',
  styleUrls: [
    './custom-time-range-slider.component.scss',
    '../../../../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class CustomTimeRangeSliderComponent extends TimeRangeSliderComponent { }
