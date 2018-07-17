import { Component } from '@angular/core';
import { MinMaxRangeComponent } from '@helgoland/modification';

@Component({
  selector: 'n52-custom-min-max-range',
  templateUrl: './custom-min-max-range.component.html',
  styleUrls: ['./custom-min-max-range.component.scss']
})
export class CustomMinMaxRangeComponent extends MinMaxRangeComponent { }
