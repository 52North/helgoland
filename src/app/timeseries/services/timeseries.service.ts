import { Injectable } from '@angular/core';

import { Dataset } from './../../toolbox/model/api/dataset/dataset';
import { IDataset } from './../../toolbox/model/api/dataset/idataset';
import { DatasetOptions } from './../../toolbox/model/api/dataset/options';
import { Timeseries } from './../../toolbox/model/api/dataset/timeseries';
import { ApiInterface } from './../../toolbox/services/api-interface/api-interface.service';
import { LocalStorage } from './../../toolbox/services/local-storage/local-storage.service';

const TIMESERIES_OPTIONS_CACHE_PARAM = 'timeseriesOptions';
const TIMESERIES_IDS_CACHE_PARAM = 'timeseriesIds';

@Injectable()
export class TimeseriesService {

    public datasetIds: Array<string> = [];

    public datasetOptions: Map<string, DatasetOptions> = new Map();

    constructor(
        private api: ApiInterface,
        private localStorage: LocalStorage
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
        this.datasetIds.push(dataset.internalId);
        this.datasetOptions.set(dataset.internalId, this.createStyles(dataset));
        this.api.getSingleTimeseries(dataset.id, dataset.url).subscribe((res) => this.addDataset(res));
    }

    public addDatasetById(dataset: IDataset) {
        this.api.getDataset(dataset.id, dataset.url).subscribe((res) => this.addDataset(res));
    }

    private createStyles(dataset: IDataset) {
        const styles = new DatasetOptions();
        styles.internalId = dataset.internalId;
        styles.color = this.getRandomColor();
        return styles;
    }

    private getRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    public removeAllTimeseries() {
        this.datasetIds.length = 0;
        this.datasetOptions.clear();
    }

    public removeTimeseries(internalId: string) {
        const seriesIdx = this.datasetIds.indexOf(internalId);
        if (seriesIdx > -1) {
            this.datasetIds.splice(seriesIdx, 1);
            this.datasetOptions.delete(internalId);
        }
        this.saveTimeseries();
    }

    public hasTimeseries(): boolean {
        return this.datasetIds.length > 0;
    }

    public updateTimeseriesOptions(options: DatasetOptions, internalId: string) {
        this.datasetOptions.set(internalId, options);
        this.saveTimeseries();
    }

    private addDataset(dataset: IDataset) {
        this.saveTimeseries();
    }

    private saveTimeseries() {
        this.localStorage.save(TIMESERIES_IDS_CACHE_PARAM, this.datasetIds);
        this.localStorage.save(TIMESERIES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
    }

    private loadTimeseries() {
        this.localStorage.load<Array<DatasetOptions>>(TIMESERIES_OPTIONS_CACHE_PARAM)
            .forEach(e => this.datasetOptions.set(e.internalId, e));
        this.datasetIds = this.localStorage.load<Array<string>>(TIMESERIES_IDS_CACHE_PARAM);
    }
}
