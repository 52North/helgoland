import { Injectable } from '@angular/core';
import { DatasetApi, LocalStorage, RenderingHintsDatasetService } from '@helgoland/core';

const CUSTOM_SERVICE_PROVIDERS = 'customServiceProviders';

@Injectable()
export class CustomServiceProviderCache {

    private datasetApiList: Array<DatasetApi>;

    constructor(
        protected localStorage: LocalStorage,
    ) {
        this.loadState();
    }

    public addDatasetApi(api: DatasetApi){
        this.datasetApiList.push(api);
        this.saveState();
    }

    public getDatasetApis(): Array<DatasetApi>{
        return this.datasetApiList;
    }

    protected saveState(): void {
        this.localStorage.save(CUSTOM_SERVICE_PROVIDERS, this.datasetApiList);
    }

    protected loadState(): void {
        this.datasetApiList = this.localStorage.loadArray<DatasetApi>(CUSTOM_SERVICE_PROVIDERS);
        if(!this.datasetApiList){
            this.datasetApiList = [];
        }
    }
}