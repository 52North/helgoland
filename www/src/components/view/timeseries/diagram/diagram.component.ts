import { Component, OnInit } from '@angular/core';
import { TimeseriesService } from '../services/timeseries.service';
import { IDataset, Timespan } from '../../../../model';

@Component({
    selector: 'n52-timeseries-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.scss']
})
export class TimeseriesDiagramComponent implements OnInit {

    public timeseries: Array<IDataset>;
    public timespan: Timespan;

    public diagramOptions = {
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
            downsample: {
                threshold: 0
            },
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

    public overviewOptions = {
        series: {
            downsample: {
                threshold: 0
            },
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
        annotation: {
            hide: true
        },
        touch: {
            pan: '',
            scale: ''
        }
    };

    constructor(
        private timeseriesService: TimeseriesService
    ) { }

    public ngOnInit() {
        this.timeseries = this.timeseriesService.timeseries;
        // TODO set range to overviewOptions out of timeService
        this.timespan = new Timespan(new Date(1372747500000), new Date(1372862200000));

        this.timeseriesService.loadData(this.timespan);
        // this.overviewOptions.xaxis['min'] = 1372600000000;
        // this.overviewOptions.xaxis['max'] = 1372900000000;
    }

    public delete(dataset: IDataset) {
        this.timeseriesService.removeTimeseries(dataset);
    }

    public timeChanged(timespan: Timespan) {
        this.timespan = timespan;
        this.timeseriesService.loadData(this.timespan);
        // TODO set time in timeservice???
    }

}
