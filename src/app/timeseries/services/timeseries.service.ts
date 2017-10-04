import { Injectable } from '@angular/core';

import { DatasetService } from '../../toolbox/services/dataset/dataset.service';
import { IDataset } from './../../toolbox/model/api/dataset/idataset';
import { DatasetOptions } from './../../toolbox/model/api/dataset/options';
import { LocalStorage } from './../../toolbox/services/local-storage/local-storage.service';

const TIMESERIES_OPTIONS_CACHE_PARAM = 'timeseriesOptions';
const TIMESERIES_IDS_CACHE_PARAM = 'timeseriesIds';

@Injectable()
export class TimeseriesService extends DatasetService<DatasetOptions> {

    constructor(
        protected localStorage: LocalStorage
    ) {
        super(localStorage);
    }

    protected createStyles(internalId: string) {
        const styles = new DatasetOptions(internalId);
        styles.color = this.getRandomColor();
        return styles;
    }

    protected saveState(): void {
        this.localStorage.save(TIMESERIES_IDS_CACHE_PARAM, this.datasetIds);
        this.localStorage.save(TIMESERIES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
    }

    protected loadState(): void {
        this.localStorage.loadArray<DatasetOptions>(TIMESERIES_OPTIONS_CACHE_PARAM)
            .forEach(e => this.datasetOptions.set(e.internalId, e));
        this.datasetIds = this.localStorage.loadArray<string>(TIMESERIES_IDS_CACHE_PARAM);
    }

    private getRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

}
