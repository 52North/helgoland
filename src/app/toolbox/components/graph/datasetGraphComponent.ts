import {
    DoCheck,
    EventEmitter,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';

import { DatasetOptions } from '../../model/api/dataset/options';
import { ResizableComponent } from '../../model/internal/ResizableComponent';
import { TimeInterval } from '../../model/internal/time-interval';
import { Timespan } from './../../model/internal/time-interval';
import { ApiInterface } from './../../services/api-interface/api-interface.service';
import { InternalIdHandler } from './../../services/api-interface/internal-id-handler.service';
import { Time } from './../../services/time/time.service';

const equal = require('deep-equal');

export abstract class DatasetGraphComponent<T extends DatasetOptions | Array<DatasetOptions>>
    extends ResizableComponent implements OnChanges, DoCheck {

    @Input()
    public datasetIds: Array<string>;
    private datasetIdsDiffer: IterableDiffer<string>;

    @Input()
    public selectedDatasetIds: Array<string>;
    private selectedDatasetIdsDiffer: IterableDiffer<string>;

    @Input()
    public timeInterval: TimeInterval;

    @Input()
    public datasetOptions: Map<string, T>;
    public oldDatasetOptions: Map<string, T>;

    @Input()
    public graphOptions: any;
    private oldGraphOptions: any;

    @Output()
    public onDatasetSelected: EventEmitter<Array<string>> = new EventEmitter();

    @Output()
    public onTimespanChanged: EventEmitter<Timespan> = new EventEmitter();

    @Output()
    public onMessageThrown: EventEmitter<GraphMessage> = new EventEmitter();

    protected timespan: Timespan;

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: ApiInterface,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time
    ) {
        super();
        this.datasetIdsDiffer = this.iterableDiffers.find([]).create();
        this.selectedDatasetIdsDiffer = this.iterableDiffers.find([]).create();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.timeInterval && this.timeInterval) {
            this.timespan = this.timeSrvc.createTimespanOfInterval(this.timeInterval);
            this.timeIntervalChanges();
        }
    }

    public ngDoCheck(): void {
        const datasetIdsChanges = this.datasetIdsDiffer.diff(this.datasetIds);
        if (datasetIdsChanges) {
            datasetIdsChanges.forEachAddedItem(addedItem => {
                this.addDatasetByInternalId(addedItem.item);
            });
            datasetIdsChanges.forEachRemovedItem(removedItem => {
                this.removeDataset(removedItem.item);
            });
        }

        const selectedDatasetIdsChanges = this.selectedDatasetIdsDiffer.diff(this.selectedDatasetIds);
        if (selectedDatasetIdsChanges) {
            selectedDatasetIdsChanges.forEachAddedItem(addedItem => {
                this.setSelectedId(addedItem.item);
            });
            selectedDatasetIdsChanges.forEachRemovedItem(removedItem => {
                this.removeSelectedId(removedItem.item);
            });
        }

        if (!equal(this.oldGraphOptions, this.graphOptions)) {
            this.oldGraphOptions = JSON.parse(JSON.stringify(this.graphOptions));
            const options = JSON.parse(JSON.stringify(this.graphOptions));
            this.graphOptionsChanged(options);
        }

        if (this.datasetOptions) {
            const firstChange = this.oldDatasetOptions === undefined;
            if (firstChange) { this.oldDatasetOptions = new Map(); }
            this.datasetOptions.forEach((value, key) => {
                if (!equal(value, this.oldDatasetOptions.get(key))) {
                    this.oldDatasetOptions.set(key, JSON.parse(JSON.stringify(this.datasetOptions.get(key))));
                    this.datasetOptionsChanged(key, value, firstChange);
                }
            });
        }
    }

    protected addDatasetByInternalId(internalId: string) {
        const internalIdObj = this.datasetIdResolver.resolveInternalId(internalId);
        this.addDataset(internalIdObj.id, internalIdObj.url);
    }

    protected abstract timeIntervalChanges(): void;

    protected abstract addDataset(id: string, url: string): void;

    protected abstract removeDataset(internalId: string): void;

    protected abstract setSelectedId(internalId: string): void;

    protected abstract removeSelectedId(internalId: string): void;

    protected abstract graphOptionsChanged(options: any): void;

    protected abstract datasetOptionsChanged(internalId: string, options: T, firstChange: boolean): void;

}

export interface GraphMessage {
    type: GraphMessageType;
    message: string;
}

export enum GraphMessageType {
    ERROR,
    INFO
}

export interface GraphHighlight {
    internalId: string;
    dataIndex: number;
}
