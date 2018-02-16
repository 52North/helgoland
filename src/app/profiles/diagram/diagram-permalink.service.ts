import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColorService, TimedDatasetOptions } from '@helgoland/core';
import { PermalinkService } from '@helgoland/permalink';

import { ProfilesService } from './../services/profiles.service';

const PARAM_PROFILES = 'profiles';
const PARAM_SEPERATOR = '|';
const PARAM_TIME_SEPERATOR = '_';
const PARAM_BLOCK_SEPERATOR = '!!';

@Injectable()
export class ProfilesDiagramPermalink extends PermalinkService<void> {

    constructor(
        private profilesSrvc: ProfilesService,
        private activatedRoute: ActivatedRoute,
        private color: ColorService
    ) {
        super();
    }

    public generatePermalink(): string {
        const parameters: Array<string> = [];
        this.profilesSrvc.datasetIds.forEach(internalId => {
            if (this.profilesSrvc.datasetOptions.has(internalId)) {
                const timestamps: Array<number> = [];
                this.profilesSrvc.datasetOptions.get(internalId).forEach(o => timestamps.push(o.timestamp));
                parameters.push(internalId + PARAM_SEPERATOR + timestamps.join(PARAM_TIME_SEPERATOR));
            }
        });
        if (parameters.length > 0) {
            return this.createBaseUrl() + '?' + PARAM_PROFILES + '=' + encodeURIComponent(parameters.join(PARAM_BLOCK_SEPERATOR));
        } else {
            return this.createBaseUrl();
        }
    }

    public validatePeramlink(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params[PARAM_PROFILES]) {
                this.profilesSrvc.removeAllDatasets();
                const parameters: Array<string> = params[PARAM_PROFILES].split(PARAM_BLOCK_SEPERATOR);
                parameters.forEach(param => {
                    const profileParam = param.split(PARAM_SEPERATOR);
                    if (profileParam.length === 2) {
                        const internalId = profileParam[0];
                        const timestamps = profileParam[1].split(PARAM_TIME_SEPERATOR);
                        const options = timestamps.map(timestamp => {
                            return new TimedDatasetOptions(internalId, this.color.getColor(), parseInt(timestamp, 10));
                        });
                        this.profilesSrvc.addDataset(internalId, options);
                    }
                });
            }
        });
    }

}
