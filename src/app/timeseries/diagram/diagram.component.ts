import { Component, OnInit } from '@angular/core';

import { Data, IDataEntry } from './../../toolbox/model/api/data';
import { IDataset } from './../../toolbox/model/api/dataset/idataset';
import { PlotOptions } from './../../toolbox/model/internal/flot/plotOptions';
import { Timespan } from './../../toolbox/model/internal/time-interval';
import { Time } from './../../toolbox/services/time/time.service';
import { TimeseriesService } from './../services/timeseries.service';

const TIME_CACHE_PARAM = 'timeseries-time';

@Component({
  selector: 'n52-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class TimeseriesDiagramComponent implements OnInit {

  public timeseries: Array<IDataset>;
  public data: Array<Data<IDataEntry>>;
  public timespan: Timespan;

  public diagramOptions: PlotOptions = {
    crosshair: {
      mode: 'x'
    },
    grid: {
      autoHighlight: true,
      hoverable: true
    },
    legend: {
      show: false
    },
    pan: {
      frameRate: 10,
      interactive: true
    },
    selection: {
      mode: null
    },
    series: {
      // downsample: {
      //   threshold: 0
      // },
      lines: {
        fill: false,
        show: true
      },
      points: {
        fill: true,
        radius: 2,
        show: false
      },
      //            points : {
      //                 show: true
      //            },
      shadowSize: 1
    },
    touch: {
      delayTouchEnded: 200,
      pan: 'x',
      scale: ''
    },
    xaxis: {
      mode: 'time',
      timezone: 'browser',
      // monthNames: monthNamesTranslaterServ.getMonthNames()
      //            timeformat: '%Y/%m/%d',
      // use these the following two lines to have small ticks at the bottom ob the diagram
      //            tickLength: 5,
      //            tickColor: '#000'
    },
    yaxis: {
      additionalWidth: 17,
      labelWidth: 50,
      min: null,
      panRange: false,
      show: true,
      // tickFormatter: function(val, axis) {
      //     var factor = axis.tickDecimals ? Math.pow(10, axis.tickDecimals) : 1;
      //     var formatted = '' + Math.round(val * factor) / factor;
      //     return formatted + '<br>' + this.uom;
      // }
    },
  };

  public overviewOptions: PlotOptions = {
    series: {
      // downsample: {
      //   threshold: 0
      // },
      points: {
        show: false,
        radius: 1
      },
      lines: {
        show: true,
        fill: false
      },
      shadowSize: 1
    },
    selection: {
      mode: 'overview',
      color: '#718296',
      shape: 'butt',
      minSize: 30
    },
    grid: {
      hoverable: false,
      autoHighlight: false
    },
    xaxis: {
      mode: 'time',
      timezone: 'browser',
      // monthNames: monthNamesTranslaterServ.getMonthNames()
    },
    yaxis: {
      show: false
    },
    legend: {
      show: false
    },
    touch: {
      pan: '',
      scale: ''
    }
  };

  constructor(
    private timeseriesService: TimeseriesService,
    private timeSrvc: Time
  ) { }

  public ngOnInit() {
    this.timeseries = this.timeseriesService.timeseries;
    this.data = this.timeseriesService.data;
    this.updateTime(this.timeSrvc.loadTimespan(TIME_CACHE_PARAM) || this.timeSrvc.initTimespan());
  }

  public delete(dataset: IDataset) {
    this.timeseriesService.removeTimeseries(dataset);
  }

  public timeChanged(timespan: Timespan) {
    this.updateTime(timespan);
  }

  public jumpToDate(date: Date) {
    this.updateTime(this.timeSrvc.centerTimespan(this.timespan, date));
  }

  private updateTime(timespan: Timespan) {
    this.timespan = timespan;
    this.timeSrvc.saveTimespan(TIME_CACHE_PARAM, timespan);
    this.timeseriesService.loadData(timespan);
  }

}
