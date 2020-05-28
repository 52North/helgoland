import { Component, OnInit } from '@angular/core';
import { TimezoneService } from '@helgoland/core';

@Component({
  selector: 'n52-timezone-selector',
  templateUrl: './timezone-selector.component.html',
  styleUrls: ['./timezone-selector.component.scss']
})
export class TimezoneSelectorComponent implements OnInit {

  public currentTz: string;

  public timezones = [
    'America/New_York',
    'Pacific/Honolulu',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Iran',
    'Etc/UTC'
  ];

  constructor(
    private timezoneSrvc: TimezoneService
  ) { }

  ngOnInit() {
    this.currentTz = this.timezoneSrvc.getTimezoneName();
  }

  setTimezone(tz: string) {
    this.currentTz = tz;
    this.timezoneSrvc.setTimezone(tz);
  }

}
