import { Injectable } from '@angular/core';
import { ColorService, DatasetService, LocalStorage, TimedDatasetOptions } from '@helgoland/core';

const PROFILES_OPTIONS_CACHE_PARAM = 'profilesOptions';
const PROFILES_IDS_CACHE_PARAM = 'profilesIds';

@Injectable()
export class ProfilesService extends DatasetService<Array<TimedDatasetOptions>> {

    constructor(
        protected localStorage: LocalStorage,
        private color: ColorService
    ) {
        super();
        this.loadState();
    }

    public addDataset(internalId: string, options?: Array<TimedDatasetOptions>) {
        if (this.datasetOptions.has(internalId)) {
            options.forEach(entry => {
                if (!this.datasetOptions.get(internalId).find(e => e.timestamp === entry.timestamp)) {
                    this.datasetOptions.get(internalId).push(entry);
                    this.saveState();
                }
            });
        } else {
            super.addDataset(internalId, options);
        }
    }

    protected createStyles(internalId: string): Array<TimedDatasetOptions> {
        return [new TimedDatasetOptions(internalId, this.color.getColor(), 0)];
    }

    protected saveState(): void {
        this.localStorage.save(PROFILES_IDS_CACHE_PARAM, this.datasetIds);
        this.localStorage.save(PROFILES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
    }

    protected loadState(): void {
        this.localStorage.loadArray<Array<TimedDatasetOptions>>(PROFILES_OPTIONS_CACHE_PARAM)
            .forEach(e => this.datasetOptions.set(e[0].internalId, e));
        this.datasetIds = this.localStorage.loadArray<string>(PROFILES_IDS_CACHE_PARAM);
    }

    public removeDatasetOptions(options: TimedDatasetOptions) {
        if (this.datasetOptions.has(options.internalId)) {
            const idx = this.datasetOptions.get(options.internalId).findIndex(e => e.timestamp === options.timestamp);
            if (idx > -1) {
                if (this.datasetOptions.get(options.internalId).length === 1) {
                    this.removeDataset(options.internalId);
                } else {
                    this.datasetOptions.get(options.internalId).splice(idx, 1);
                }
            }
        }
    }

}
