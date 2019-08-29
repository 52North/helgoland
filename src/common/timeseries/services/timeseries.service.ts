import { Injectable } from '@angular/core';
import {
    ColorService,
    DatasetApiInterface,
    DatasetOptions,
    LocalStorage,
    RenderingHintsDatasetService,
    SettingsService,
    Time,
    Timespan,
} from '@helgoland/core';
import { duration, MomentInputObject } from 'moment';

import { HelgolandSettings } from './../../settings/helgoland-settings';

const TIMESERIES_OPTIONS_CACHE_PARAM = 'timeseriesOptions';
const TIMESERIES_IDS_CACHE_PARAM = 'timeseriesIds';
const TIME_CACHE_PARAM = 'timeseriesTime';

@Injectable()
export class TimeseriesService extends RenderingHintsDatasetService<DatasetOptions> {

    public timespan: Timespan;

    constructor(
        protected localStorage: LocalStorage,
        protected timeSrvc: Time,
        protected api: DatasetApiInterface,
        private settingsSrvc: SettingsService<HelgolandSettings>,
        private color: ColorService
    ) {
        super(api);
        this.loadState();
    }

    protected createStyles(internalId: string) {
        const options = new DatasetOptions(internalId, this.color.getColor());
        options.generalize = false;
        return options;
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
        const options = this.localStorage.loadArray<DatasetOptions>(TIMESERIES_OPTIONS_CACHE_PARAM);
        if (options) { options.forEach(e => this.datasetOptions.set(e.internalId, e)); }
        this.datasetIds = this.localStorage.loadArray<string>(TIMESERIES_IDS_CACHE_PARAM) || [];
        this.timespan = this.timeSrvc.loadTimespan(TIME_CACHE_PARAM) || this.initTimespan();
    }

    private initTimespan(): Timespan {
        const defDuration = this.settingsSrvc.getSettings().defaultTimeseriesTimeduration;
        if (defDuration && defDuration.duration && defDuration.align) {
            return this.generateTimespan(defDuration.duration, defDuration.align);
        } else {
            return this.timeSrvc.initTimespan();
        }
    }

    // TODO: use time service for this
    private generateTimespan(defaultTimeseriesTimeduration: MomentInputObject, align: 'start' | 'center' | 'end'): Timespan {
        const now = new Date();
        const d = duration(defaultTimeseriesTimeduration);
        switch (align) {
            case 'start':
                return new Timespan(now.getTime(), now.getTime() + d.asMilliseconds());
            case 'end':
                return new Timespan(now.getTime() - d.asMilliseconds(), now.getTime());
            case 'center':
            default:
                const half = d.asMilliseconds() / 2;
                return new Timespan(now.getTime() - half, now.getTime() + half);
        }
    }

}
