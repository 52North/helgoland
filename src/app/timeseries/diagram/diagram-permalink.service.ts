import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermalinkService, Timespan } from 'helgoland-toolbox';

import { TimeseriesService } from '../services/timeseries.service';

const PARAM_IDS = 'ids';
const ID_SEPERATOR = '!!';
const PARAM_TIME = 'time';
const TIME_SEPERATOR = '|';

@Injectable()
export class TimeseriesDiagramPermalink extends PermalinkService<void> {

    constructor(
        private activatedRoute: ActivatedRoute,
        private timeseriesSrvc: TimeseriesService
    ) {
        super();
    }

    public generatePermalink(): string {
        let paramUrl = '';
        if (this.timeseriesSrvc.hasDatasets()) {
            const id = this.timeseriesSrvc.datasetIds.join(ID_SEPERATOR);
            paramUrl = this.createBaseUrl() + '?' + PARAM_IDS + '=' + encodeURIComponent(id);
            if (this.timeseriesSrvc.timespan) {
                paramUrl = paramUrl + '&' + PARAM_TIME + '=' + encodeURIComponent(this.timeseriesSrvc.timespan.from
                    + TIME_SEPERATOR + this.timeseriesSrvc.timespan.to);
            }
        }
        return paramUrl;
    }

    public validatePeramlink(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params[PARAM_IDS]) {
                this.timeseriesSrvc.removeAllDatasets();
                const ids = (params[PARAM_IDS] as string).split(ID_SEPERATOR);
                ids.forEach(id => {
                    this.timeseriesSrvc.addDataset(id);
                });
                if (params[PARAM_TIME]) {
                    const time = (params[PARAM_TIME] as string).split(TIME_SEPERATOR);
                    if (time.length === 2) {
                        const start = parseInt(time[0], 10);
                        const end = parseInt(time[1], 10);
                        this.timeseriesSrvc.setTimespan(new Timespan(start, end));
                    }
                }
            }
        });
    }
}
