import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InternalIdHandler } from 'helgoland-toolbox';

export abstract class ListEntryComponent implements OnInit {

    @Input()
    public datasetId: string;

    @Input()
    public selected: boolean;

    @Output()
    public onDeleteDataset: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public onSelectDataset: EventEmitter<boolean> = new EventEmitter();

    constructor(
        protected internalIdHandler: InternalIdHandler
    ) { }

    ngOnInit(): void {
        const temp = this.internalIdHandler.resolveInternalId(this.datasetId);
        this.loadDataset(temp.id, temp.url);
    }

    public removeDataset() {
        this.onDeleteDataset.emit(true);
    }

    public toggleSelection() {
        this.selected = !this.selected;
        this.onSelectDataset.emit(this.selected);
    }

    protected abstract loadDataset(id: string, url: string): void;
}
