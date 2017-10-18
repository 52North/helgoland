import { Injectable } from '@angular/core';
import { ColorService, DatasetOptions, DatasetService, LocalStorage, Time, Timespan } from 'helgoland-toolbox';

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
