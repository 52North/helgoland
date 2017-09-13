import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Settings } from '../../../services/settings/settings.service';

@Component({
  selector: 'n52-timeseries-style-selector',
  templateUrl: './timeseries-style-selector.component.html',
  styleUrls: ['./timeseries-style-selector.component.scss']
})
export class TimeseriesStyleSelectorComponent implements OnInit {

  @Input()
  public timeseriesColor;

  @Output()
  public onColorChange: EventEmitter<string> = new EventEmitter<string>();

  public timeseriesColorRamp;

  constructor(private settingSrvc: Settings) { }

  ngOnInit() {  
    this.timeseriesColorRamp = this.settingSrvc.config.colorList;
  }
}
