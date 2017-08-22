import { Injectable } from '@angular/core';
import { ApiInterface } from '../../../../services/api-interface';
import { LocalStorage } from '../../../../services/local-storage';
import { IDataset, Dataset, Timeseries } from '../../../../model';
import { deserializeArray } from 'class-transformer';

const TIMESERIES_CACHE_PARAM = 'timeseries';

@Injectable()
export class TimeseriesService {

    public timeseries: Array<IDataset> = [];

    public timeseriesData: Array<any> = [];

    constructor(
        private api: ApiInterface,
        private localStorage: LocalStorage
    ) {
        this.loadTimeseries();
    }

    public addTimeseries(dataset: IDataset, url: string) {
        if (dataset instanceof Dataset) {
            this.addDatasetById(dataset.id, url);
        } else if (dataset instanceof Timeseries) {
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

    public removeTimeseries(dataset: IDataset) {
        const idx = this.findTimeseriesIdx(dataset);
        this.timeseries.splice(idx, 1);
        this.saveTimeseries();
    }

    private addDataset(dataset: IDataset) {
        this.timeseries.push(dataset);
        this.saveTimeseries();
    }

    private findTimeseriesIdx(dataset: IDataset) {
        return this.timeseries.findIndex((entry) => {
            return entry.id === dataset.id && entry.url === dataset.url;
        });
    }

    private saveTimeseries() {
        this.localStorage.save(TIMESERIES_CACHE_PARAM, this.timeseries);
    }

    private loadTimeseries() {
        const json = this.localStorage.loadTextual(TIMESERIES_CACHE_PARAM);
        if (json) {
            const result = deserializeArray<Timeseries>(Timeseries, json);
            this.timeseries = result;
        }
    }

}
