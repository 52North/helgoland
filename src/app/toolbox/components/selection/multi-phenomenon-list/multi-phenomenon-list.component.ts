import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ApiInterface, ColorService, Dataset, DatasetOptions, IDataset, PlatformTypes } from 'helgoland-toolbox';

interface SelectableDataset extends Dataset {
    selected: boolean;
    color: string;
}

@Component({
    selector: 'n52-multi-phenomenon-list',
    templateUrl: './multi-phenomenon-list.component.html',
    styleUrls: ['./multi-phenomenon-list.component.scss']
})
export class MultiPhenomenonListComponent implements OnChanges {

    @Input()
    public dataset: IDataset;

    @Input()
    public datasetIds: Array<string>;

    @Input()
    public datasetOptions: Map<string, DatasetOptions>;

    @Output()
    public onAddDataset: EventEmitter<DatasetOptions> = new EventEmitter();

    @Output()
    public onRemoveDataset: EventEmitter<string> = new EventEmitter();

    public visible: boolean;

    public datasetList: Array<SelectableDataset> = new Array();

    constructor(
        private api: ApiInterface,
        private color: ColorService
    ) { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.dataset && this.dataset) {
            this.api.getDatasets(this.dataset.url,
                {
                    platformTypes: PlatformTypes.mobile,
                    features: this.dataset.parameters.feature.id,
                    expanded: true
                })
                .subscribe(res => {
                    this.visible = res.length > 1;
                    res.forEach(entry => {
                        let color;
                        if (this.datasetOptions.has(entry.internalId)) {
                            color = this.datasetOptions.get(entry.internalId).color;
                        } else {
                            color = this.color.getColor();
                        }
                        if (this.dataset.parameters.phenomenon.id !== entry.parameters.phenomenon.id) {
                            const temp = entry as SelectableDataset;
                            temp.selected = this.datasetIds.indexOf(entry.internalId) > -1 ? true : false;
                            temp.color = color;
                            this.datasetList.push(temp);
                        }
                    });
                });
        }
    }

    public toggleSelection(dataset: SelectableDataset) {
        dataset.selected = !dataset.selected;
        if (dataset.selected) {
            this.onAddDataset.emit(new DatasetOptions(dataset.internalId, dataset.color));
        } else {
            this.onRemoveDataset.emit(dataset.internalId);
        }
    }
}
