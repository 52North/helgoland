import { Injectable } from '@angular/core';

import { ColorService } from '../../toolbox/services/color/color.service';
import { DatasetService } from '../../toolbox/services/dataset/dataset.service';
import { Time } from '../../toolbox/services/time/time.service';
import { DatasetOptions } from './../../toolbox/model/api/dataset/options';
import { Timespan } from './../../toolbox/model/internal/time-interval';
import { LocalStorage } from './../../toolbox/services/local-storage/local-storage.service';

const TIMESERIES_OPTIONS_CACHE_PARAM = 'timeseriesOptions';
const TIMESERIES_IDS_CACHE_PARAM = 'timeseriesIds';
const TIME_CACHE_PARAM = 'timeseriesTime';

@Injectable()
export class TimeseriesService extends DatasetService<DatasetOptions> {

    public timespan: Timespan;

    constructor(
        protected localStorage: LocalStorage,
        protected timeSrvc: Time,
        private color: ColorService
    ) {
        super(localStorage);
        this.loadState();
    }

    protected createStyles(internalId: string) {
        return new DatasetOptions(internalId, this.color.getColor());
    }

    public setTimespan(timespan: Timespan) {
        this.timespan = timespan;
        this.saveState();
    }

    protected saveState(): void {
        this.localStorage.save(TIMESERIES_IDS_CACHE_PARAM, this.datasetIds);
        this.localStorage.save(TIMESERIES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
        this.timeSrvc.saveTimespan(TIME_CACHE_PARAM, this.timespan);
    }

    protected loadState(): void {
        this.localStorage.loadArray<DatasetOptions>(TIMESERIES_OPTIONS_CACHE_PARAM)
            .forEach(e => this.datasetOptions.set(e.internalId, e));
        this.datasetIds = this.localStorage.loadArray<string>(TIMESERIES_IDS_CACHE_PARAM);
        this.timespan = this.timeSrvc.loadTimespan(TIME_CACHE_PARAM) || this.timeSrvc.initTimespan();
    }

}
