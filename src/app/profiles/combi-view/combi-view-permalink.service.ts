import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TimedDatasetOptions } from './../../toolbox/model/api/dataset/options';
import { ColorService } from './../../toolbox/services/color/color.service';
import { PermalinkService } from './../../toolbox/services/permalink/permalink.service';
import { ProfilesCombiService } from './combi-view.service';

const PARAM_ID = 'id';
const PARAM_TIME = 'time';

@Injectable()
export class ProfilesCombiViewPermalink extends PermalinkService<void> {

    constructor(
        private activatedRoute: ActivatedRoute,
        private combiSrvc: ProfilesCombiService,
        private color: ColorService
    ) {
        super();
    }

    public generatePermalink(): string {
        const id = this.combiSrvc.datasetIds[0];
        const time = this.combiSrvc.datasetOptions.get(id)[0].timestamp;
        return this.createBaseUrl() + '?' + PARAM_ID + '=' + encodeURIComponent(id) + '&' + PARAM_TIME + '=' + time;
    }

    public validatePeramlink(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params[PARAM_ID] && params[PARAM_TIME]) {
                this.combiSrvc.removeAllDatasets();
                const id = params[PARAM_ID];
                const time: number = parseInt(params[PARAM_TIME], 10);
                const options = new TimedDatasetOptions(id, this.color.getColor(), time);
                this.combiSrvc.addDataset(id, [options]);
            }
        });
    }
}
