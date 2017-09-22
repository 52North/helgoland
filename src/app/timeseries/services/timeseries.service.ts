import { Injectable } from '@angular/core';
import { deserializeArray } from 'class-transformer';

import { Data } from './../../toolbox/model/api/data';
import { Dataset } from './../../toolbox/model/api/dataset/dataset';
import { IDataset } from './../../toolbox/model/api/dataset/idataset';
import { Timeseries } from './../../toolbox/model/api/timeseries';
import { Timespan } from './../../toolbox/model/internal/time-interval';
import { ApiInterface } from './../../toolbox/services/api-interface/api-interface.service';
import { LocalStorage } from './../../toolbox/services/local-storage/local-storage.service';
import { Time } from './../../toolbox/services/time/time.service';

const TIMESERIES_CACHE_PARAM = 'timeseries';
const TIMESERIES_IDS_CACHE_PARAM = 'timeseriesIds';

@Injectable()
export class TimeseriesService {

    public timeseries: Array<IDataset> = [];

    public seriesIds: Array<string> = [];

    public data: Array<Data<[2]>> = [];

    constructor(
        private api: ApiInterface,
        private localStorage: LocalStorage,
        private timeSrvc: Time
    ) {
        this.loadTimeseries();
    }

    public addTimeseries(dataset: IDataset) {
        if (dataset instanceof Dataset) {
            this.addDatasetById(dataset);
        } else if (dataset instanceof Timeseries) {
            this.addTimeseriesBy(dataset);
        }
    }

    public addTimeseriesBy(dataset: IDataset) {
        this.seriesIds.push(dataset.internalId);
        this.api.getSingleTimeseries(dataset.id, dataset.url).subscribe((res) => this.addDataset(res));
    }

    public addDatasetById(dataset: IDataset) {
        this.api.getDataset(dataset.id, dataset.url).subscribe((res) => this.addDataset(res));
    }

    public removeAllTimeseries() {
        this.seriesIds.length = 0;
        this.timeseries.length = 0;
    }

    public removeTimeseries(dataset: IDataset) {
        const seriesIdx = this.seriesIds.indexOf(dataset.internalId);
        if (seriesIdx > -1) {
            this.seriesIds.splice(seriesIdx, 1);
        }
        const idx = this.findTimeseriesIdx(dataset);
        this.timeseries.splice(idx, 1);
        this.data.splice(idx, 1);
        this.saveTimeseries();
    }

    public loadData(timespan: Timespan) {
        this.timeseries.forEach((entry, idx) => {
            entry.styles.loading = true;
            this.data[idx] = null;
            const buffer = this.timeSrvc.getBufferedTimespan(timespan, 0.2);
            this.api.getTsData<[2]>(entry.id, entry.url, buffer, { format: 'flot', generalize: false }).subscribe((result) => {
                entry.hasData = result.values && result.values.length > 0;
                this.data[idx] = result;
                entry.styles.loading = false;
            });
        });
    }

    public hasTimeseries(): boolean {
        return this.seriesIds.length > 0;
    }

    private addDataset(dataset: IDataset) {
        this.timeseries.push(dataset);
        this.data.push(null);
        this.saveTimeseries();
    }

    private findTimeseriesIdx(dataset: IDataset) {
        return this.timeseries.findIndex((entry) => {
            return entry.id === dataset.id && entry.url === dataset.url;
        });
    }

    private saveTimeseries() {
        this.localStorage.save(TIMESERIES_CACHE_PARAM, this.timeseries);
        this.localStorage.save(TIMESERIES_IDS_CACHE_PARAM, this.seriesIds);
    }

    private loadTimeseries() {
        const json = this.localStorage.loadTextual(TIMESERIES_CACHE_PARAM);
        if (json) {
            const result = deserializeArray<Timeseries>(Timeseries, json);
            this.timeseries = result;
        }
        this.seriesIds = this.localStorage.load(TIMESERIES_IDS_CACHE_PARAM);
    }
}
