import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiInterface, Dataset, InternalIdHandler, TimedDatasetOptions } from 'helgoland-toolbox';

import { ListEntryComponent } from '../list-entry.component';

@Component({
    selector: 'n52-profile-entry',
    templateUrl: './profile-entry.component.html',
    styleUrls: ['./profile-entry.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileEntryComponent extends ListEntryComponent {

    @ViewChild('modalTimeseriesStyleSelector')
    public modalTimeseriesStyleSelector: TemplateRef<any>;

    @Input()
    public datasetOptions: TimedDatasetOptions;

    @Output()
    public onUpdateOptions: EventEmitter<TimedDatasetOptions> = new EventEmitter();

    @Output()
    public onDeleteDatasetOptions: EventEmitter<TimedDatasetOptions> = new EventEmitter();

    public dataset: Dataset;

    public editableOptions: TimedDatasetOptions;
    public tempColor: string;

    constructor(
        private modalService: NgbModal,
        private api: ApiInterface,
        protected internalIdHandler: InternalIdHandler
    ) {
        super(internalIdHandler);
    }

    protected loadDataset(id: string, url: string) {
        this.api.getDataset(id, url).subscribe(dataset => {
            this.dataset = dataset;
        });
    }

    public removeDatasetOptions(options: TimedDatasetOptions) {
        this.onDeleteDatasetOptions.emit(options);
    }

    public editColor(options: TimedDatasetOptions) {
        this.modalService.open(this.modalTimeseriesStyleSelector);
        this.editableOptions = options;
    }

    public updateColor() {
        this.editableOptions.color = this.tempColor;
        this.onUpdateOptions.emit(this.datasetOptions);
    }

    public toggleVisibility(options: TimedDatasetOptions) {
        options.visible = !options.visible;
        this.onUpdateOptions.emit(this.datasetOptions);
    }

}
