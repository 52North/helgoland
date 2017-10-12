import { Injectable } from '@angular/core';

import { DatasetService } from '../../toolbox/services/dataset/dataset.service';
import { DatasetOptions } from './../../toolbox/model/api/dataset/options';
import { ColorService } from './../../toolbox/services/color/color.service';
import { LocalStorage } from './../../toolbox/services/local-storage/local-storage.service';

const TRAJECTORY_IDS_PARAM = 'trajectory-ids';
const TRAJECTORY_OPTIONS_PARAM = 'trajectory-options';

@Injectable()
export class TrajectoriesService extends DatasetService<DatasetOptions> {

    constructor(
        protected localStorage: LocalStorage,
        private color: ColorService
    ) {
        super(localStorage);
        this.loadState();
    }

    protected createStyles(internalId: string): DatasetOptions {
        return new DatasetOptions(internalId, this.color.getColor());
    }

    protected saveState() {
        this.localStorage.save(TRAJECTORY_IDS_PARAM, this.datasetIds);
        this.localStorage.save(TRAJECTORY_OPTIONS_PARAM, Array.from(this.datasetOptions.values()));
    }

    protected loadState() {
        this.datasetIds = this.localStorage.loadArray<string>(TRAJECTORY_IDS_PARAM);
        this.localStorage.loadArray<DatasetOptions>(TRAJECTORY_OPTIONS_PARAM).forEach(e => this.datasetOptions.set(e.internalId, e));
    }
}
