import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IDataset, Dataset, Timeseries, FirstLastValue, Styles } from '../../../model';

@Component({
    selector: 'n52-legend-entry',
    templateUrl: './legend-entry.component.html'
})
export class LegendEntryComponent implements OnInit {

    @Input()
    public dataset: IDataset;

    @Output()
    public onDeleteDataset: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public onUpdateStyles: EventEmitter<Styles> = new EventEmitter();

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

    public ngOnInit(): any {
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
    }

    public jumpToLastTimeStamp() {
    }

    public toggleSelection() {
        this.dataset.styles.selected = !this.dataset.styles.selected;
    }

    public toggleVisibility() {
        this.dataset.styles.visible = !this.dataset.styles.visible;
    }
}
