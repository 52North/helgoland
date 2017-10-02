import { LocalStorage } from '../local-storage/local-storage.service';
import { DatasetOptions } from './../../model/api/dataset/options';
import { IDataset } from './../../model/api/dataset/idataset';

export abstract class DatasetService {

    public datasetIds: Array<string> = [];

    public datasetOptions: Map<string, DatasetOptions> = new Map();

    constructor(
        protected localStorage: LocalStorage
    ) {
        this.loadState();
    }

    public addDataset(dataset: IDataset) {
        this.datasetIds.push(dataset.internalId);
        this.datasetOptions.set(dataset.internalId, this.createStyles(dataset));
        this.saveState();
    }

    public removeAllDatasets() {
        this.datasetIds.length = 0;
        this.datasetOptions.clear();
        this.saveState();
    }

    public removeDataset(internalId: string) {
        const datasetIdx = this.datasetIds.indexOf(internalId);
        if (datasetIdx > -1) {
            this.datasetIds.splice(datasetIdx, 1);
            this.datasetOptions.delete(internalId);
        }
        this.saveState();
    }

    public hasDatasets(): boolean {
        return this.datasetIds.length > 0;
    }

    public updateDatasetOptions(options: DatasetOptions, internalId: string) {
        this.datasetOptions.set(internalId, options);
        this.saveState();
    }

    protected abstract createStyles(dataset: IDataset): DatasetOptions;

    protected abstract saveState(): void;

    protected abstract loadState(): void;

}
