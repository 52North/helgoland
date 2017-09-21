import { Component } from '@angular/core';

import { TimeseriesConditionalRouter } from './../services/timeseries-router.service';

@Component({
  selector: 'n52-timeseries-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class TimeseriesNavigationComponent {

  constructor(
    private router: TimeseriesConditionalRouter
  ) { }
}
