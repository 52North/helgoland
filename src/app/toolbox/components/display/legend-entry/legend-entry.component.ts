import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Dataset } from './../../../model/api/dataset/dataset';
import { FirstLastValue } from './../../../model/api/dataset/firstLastValue';
import { IDataset } from './../../../model/api/dataset/idataset';
import { Styles } from './../../../model/api/dataset/styles';
import { Timeseries } from './../../../model/api/timeseries';

@Component({
    selector: 'n52-legend-entry',
    templateUrl: './legend-entry.component.html',
    styleUrls: ['./legend-entry.component.scss']
})
export class LegendEntryComponent implements OnInit {

    @Input()
    public dataset: IDataset;

    @Input()
    public datasetOptions: Styles;

    @Output()
    public onDeleteDataset: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public onSelectDataset: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public onUpdateOptions: EventEmitter<Styles> = new EventEmitter();

    @Output()
    public onSelectDate: EventEmitter<Date> = new EventEmitter();

    public platformLabel: string;
    public phenomenonLabel: string;
    public procedureLabel: string;
    public categoryLabel: string;
    public uom: string;
    public firstValue: FirstLastValue;
    public lastValue: FirstLastValue;
    public informationVisible = false;

    constructor(
    ) { }

    public ngOnInit() {
        if (this.dataset instanceof Dataset) {
            this.platformLabel = this.dataset.parameters.platform.label;
        } else if (this.dataset instanceof Timeseries) {
            this.platformLabel = this.dataset.station.properties.label;
        }
        this.phenomenonLabel = this.dataset.parameters.phenomenon.label;
        this.procedureLabel = this.dataset.parameters.procedure.label;
        this.categoryLabel = this.dataset.parameters.category.label;
        this.firstValue = this.dataset.firstValue;
        this.lastValue = this.dataset.lastValue;
        this.uom = this.dataset.uom;
    }

    public removeDataset() {
        this.onDeleteDataset.emit(true);
    }

    public toggleInformation() {
        this.informationVisible = !this.informationVisible;
    }

    public jumpToFirstTimeStamp() {
        this.onSelectDate.emit(new Date(this.dataset.firstValue.timestamp));
    }

    public jumpToLastTimeStamp() {
        this.onSelectDate.emit(new Date(this.dataset.lastValue.timestamp));
    }

    public toggleSelection() {
        this.datasetOptions.selected = !this.datasetOptions.selected;
        this.onSelectDataset.emit(this.datasetOptions.selected);
    }

    public toggleVisibility() {
        this.datasetOptions.visible = !this.datasetOptions.visible;
        this.onUpdateOptions.emit(this.datasetOptions);
    }

    public hasNoData(): boolean {
        return !this.datasetOptions.loading && !this.dataset.hasData;
    }
}
