import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';

import { Dataset } from './../../../model/api/dataset/dataset';
import { FirstLastValue } from './../../../model/api/dataset/firstLastValue';
import { IDataset } from './../../../model/api/dataset/idataset';
import { Styles } from './../../../model/api/dataset/styles';
import { Timeseries } from './../../../model/api/timeseries';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'n52-legend-entry',
    templateUrl: './legend-entry.component.html',
    styleUrls: ['./legend-entry.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LegendEntryComponent implements OnInit {

    @Input()
    public dataset: IDataset;

    @Output()
    public onDeleteDataset: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public onUpdateStyles: EventEmitter<Styles> = new EventEmitter();

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
    public tempColor: string;

    constructor(
        private modalService: NgbModal
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
        this.dataset.styles.selected = !this.dataset.styles.selected;
    }

    public toggleVisibility() {
        this.dataset.styles.visible = !this.dataset.styles.visible;
    }

    public hasNoData(): boolean {
        return !this.dataset.styles.loading && !this.dataset.hasData;
    }

    public open(content: TemplateRef<any>, className: string = '') {
        this.modalService.open(content, {size: 'lg', windowClass: className});
    }
}
