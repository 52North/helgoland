import { Injectable } from '@angular/core';

import { DatasetService } from '../../toolbox/services/dataset/dataset.service';
import { LocalStorage } from '../../toolbox/services/local-storage/local-storage.service';
import { TimedDatasetOptions } from './../../toolbox/model/api/dataset/options';

const COMBI_PROFILES_OPTIONS_CACHE_PARAM = 'combiProfilesOptions';
const COMBI_PROFILES_IDS_CACHE_PARAM = 'combiProfilesIds';

@Injectable()
export class ProfilesCombiService extends DatasetService<Array<TimedDatasetOptions>> {

    public datasetLabel: string;

    constructor(
        protected localStorage: LocalStorage
    ) {
        super(localStorage);
        this.loadState();
    }

    public addDataset(internalId: string, options: Array<TimedDatasetOptions>) {
        this.removeAllDatasets();
        this.datasetIds.push(internalId);
        this.datasetOptions.set(internalId, options);
        this.saveState();
    }

    protected createStyles(internalId: string): TimedDatasetOptions[] {
        throw new Error('Method not implemented.');
    }

    protected saveState(): void {
        this.localStorage.save(COMBI_PROFILES_IDS_CACHE_PARAM, this.datasetIds);
        this.localStorage.save(COMBI_PROFILES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
    }

    protected loadState(): void {
        this.datasetIds = this.localStorage.loadArray<string>(COMBI_PROFILES_IDS_CACHE_PARAM);
        this.localStorage.loadArray<Array<TimedDatasetOptions>>(COMBI_PROFILES_OPTIONS_CACHE_PARAM)
            .forEach(e => this.datasetOptions.set(e[0].internalId, e));
    }
}
