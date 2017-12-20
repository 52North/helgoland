import { Component, OnInit } from '@angular/core';
import { TimeseriesService } from '../services/timeseries.service';
import { Timespan, DatasetOptions } from 'helgoland-toolbox';

@Component({
  selector: 'n52-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TimeseriesTableComponent implements OnInit {

  public datasetIds: Array<string>;
  public selectedIds: Array<string> = new Array();
  public timespan: Timespan;
  public datasetOptions: Map<String, DatasetOptions>;

  constructor(
    private timeseriesService: TimeseriesService,
  ) { }

  public ngOnInit() {
    this.datasetIds = this.timeseriesService.datasetIds;
    this.timespan = this.timeseriesService.timespan;
    this.datasetOptions = this.timeseriesService.datasetOptions;
  }

}
