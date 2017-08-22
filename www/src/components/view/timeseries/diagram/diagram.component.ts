import { Component, OnInit } from '@angular/core';
import { TimeseriesService } from '../services/timeseries.service';
import { IDataset } from '../../../../model';

@Component({
    selector: 'n52-timeseries-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.scss']
})
export class TimeseriesDiagramComponent implements OnInit {

    public timeseries: Array<IDataset>;

    constructor(
        private timeseriesService: TimeseriesService
    ) { }

    public ngOnInit() {
        this.timeseries = this.timeseriesService.timeseries;
    }

    public delete(dataset: IDataset) {
        this.timeseriesService.removeTimeseries(dataset);
    }

}
