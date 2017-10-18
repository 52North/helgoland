import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermalinkService } from 'helgoland-toolbox';

import { TrajectoriesService } from './../services/trajectories.service';

const PARAM_ID = 'id';

@Injectable()
export class TrajectoriesViewPermalink extends PermalinkService<void> {

    constructor(
        private trajectories: TrajectoriesService,
        private activatedRoute: ActivatedRoute
    ) {
        super();
    }

    public validatePeramlink(): void {
        this.activatedRoute.queryParamMap.subscribe(map => {
            if (map.has(PARAM_ID)) {
                this.trajectories.addDataset(map.get(PARAM_ID));
            }
        });
    }

    protected generatePermalink(): string {
        if (this.trajectories.hasDatasets()) {
            return this.createBaseUrl() + '?' + PARAM_ID + '=' + encodeURIComponent(this.trajectories.datasetIds[0]);
        }
        return '';
    }

}
