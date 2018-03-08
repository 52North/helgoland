import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColorService, DatasetOptions } from '@helgoland/core';
import { PermalinkService } from '@helgoland/permalink';

import { TrajectoriesService } from './../services/trajectories.service';

const PARAM_IDS = 'id';
const PARAM_ID_SEPERATOR = '|';

@Injectable()
export class TrajectoriesViewPermalink extends PermalinkService<void> {

    constructor(
        private trajectories: TrajectoriesService,
        private activatedRoute: ActivatedRoute,
        private color: ColorService
    ) {
        super();
    }

    public validatePeramlink(): void {
        this.activatedRoute.queryParamMap.subscribe(map => {
            if (map.has(PARAM_IDS)) {
                const ids = map.get(PARAM_IDS).split(PARAM_ID_SEPERATOR);
                this.trajectories.removeAllDatasets();
                ids.forEach(entry => {
                    const option = new DatasetOptions(entry, this.color.getColor());
                    option.visible = false;
                    this.trajectories.addDataset(entry, option);
                });
            }
        });
    }

    protected generatePermalink(): string {
        if (this.trajectories.hasDatasets()) {
            return this.createBaseUrl() + '?' + PARAM_IDS + '=' + encodeURIComponent(this.trajectories.datasetIds.join(PARAM_ID_SEPERATOR));
        }
        return '';
    }

}
