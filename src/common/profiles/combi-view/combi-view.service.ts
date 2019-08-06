import { Injectable } from '@angular/core';
import { DatasetService, LocalStorage, TimedDatasetOptions } from '@helgoland/core';

const COMBI_PROFILES_OPTIONS_CACHE_PARAM = 'combiProfilesOptions';
const COMBI_PROFILES_IDS_CACHE_PARAM = 'combiProfilesIds';

@Injectable()
export class ProfilesCombiService extends DatasetService<Array<TimedDatasetOptions>> {

    public datasetLabel: string;

    constructor(
        protected localStorage: LocalStorage
    ) {
        super();
        this.loadState();
    }

    public async addDataset(internalId: string, options: Array<TimedDatasetOptions>): Promise<boolean> {
        this.removeAllDatasets();
        this.datasetIds.push(internalId);
        this.datasetOptions.set(internalId, options);
        this.saveState();
        return true;
    }

    protected createStyles(internalId: string): TimedDatasetOptions[] {
        throw new Error('Method not implemented.');
    }

    protected saveState(): void {
        this.localStorage.save(COMBI_PROFILES_IDS_CACHE_PARAM, this.datasetIds);
        this.localStorage.save(COMBI_PROFILES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
    }

    protected loadState(): void {
        this.datasetIds = this.localStorage.loadArray<string>(COMBI_PROFILES_IDS_CACHE_PARAM) || [];
        const options = this.localStorage.loadArray<Array<TimedDatasetOptions>>(COMBI_PROFILES_OPTIONS_CACHE_PARAM) || [];
        options.forEach(e => this.datasetOptions.set(e[0].internalId, e));
    }
}
