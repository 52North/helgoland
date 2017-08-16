import { Injectable } from '@angular/core';
import { ApiInterface } from '../../../../services/api-interface';
import { Dataset } from '../../../../model';

@Injectable()
export class TimeseriesService {

    public timeseries: Array<Dataset> = [];

    public timeseriesData: Array<any> = [];

    constructor(
        private api: ApiInterface
    ) { }

    public addTimeseries(dataset: Dataset, url: string) {
        if (dataset.datasetType || dataset.valueType) {
            this.addDatasetById(dataset.id, url);
        } else {
            this.addTimeseriesBy(dataset.id, url);
        }
    }

    public addTimeseriesBy(id: string, url: string) {
        this.api.getSingleTimeseries(id, url).subscribe((res) => this.addDataset(res));
    }

    public addDatasetById(id: string, url: string) {
        this.api.getDataset(id, url).subscribe((res) => this.addDataset(res));
    }

    public removeAllTimeseries() {
        this.timeseries.length = 0;
    }

    public removeTimeseries(dataset: Dataset) {
        const idx = this.findTimeseriesIdx(dataset);
        this.timeseries.splice(idx, 1);
    }

    private addDataset(dataset: Dataset) {
        this.timeseries.push(dataset);
    }

    private findTimeseriesIdx(dataset: Dataset) {
        return this.timeseries.findIndex((entry) => {
            return entry.id === dataset.id && entry.url === dataset.url;
        });
    }

}
