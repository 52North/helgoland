import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewEncapsulation,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TimeInterval } from '../../../model/internal/time-interval';
import { ListEntryComponent } from '../list-entry.component';
import { Dataset } from './../../../model/api/dataset/dataset';
import { FirstLastValue } from './../../../model/api/dataset/firstLastValue';
import { IDataset } from './../../../model/api/dataset/idataset';
import { DatasetOptions } from './../../../model/api/dataset/options';
import { Timeseries } from './../../../model/api/dataset/timeseries';
import { ApiInterface } from './../../../services/api-interface/api-interface.service';
import { InternalIdHandler } from './../../../services/api-interface/internal-id-handler.service';
import { Time } from './../../../services/time/time.service';

@Component({
    selector: 'n52-timeseries-entry',
    templateUrl: './timeseries-entry.component.html',
    styleUrls: ['./timeseries-entry.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TimeseriesEntryComponent extends ListEntryComponent implements OnChanges {

    @Input()
    public datasetOptions: DatasetOptions;

    @Input()
    public timeInterval: TimeInterval;

    @Output()
    public onUpdateOptions: EventEmitter<DatasetOptions> = new EventEmitter();

    @Output()
    public onSelectDate: EventEmitter<Date> = new EventEmitter();

    protected dataset: IDataset;

    public platformLabel: string;
    public phenomenonLabel: string;
    public procedureLabel: string;
    public categoryLabel: string;
    public uom: string;
    public firstValue: FirstLastValue;
    public lastValue: FirstLastValue;
    public informationVisible = false;
    public tempColor: string;
    public hasData = true;

    constructor(
        private modalService: NgbModal,
        private api: ApiInterface,
        private timeSrvc: Time,
        protected internalIdHandler: InternalIdHandler
    ) {
        super(internalIdHandler);
    }

    protected loadDataset(id: string, url: string) {
        this.api.getSingleTimeseries(id, url).subscribe(timeseries => {
            this.dataset = timeseries;
            this.setParameters();
        }, error => {
            this.api.getDataset(id, url).subscribe(dataset => {
                this.dataset = dataset;
                this.setParameters();
            });
        });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.timeInterval) {
            this.checkDataInTimespan();
        }
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

    public toggleVisibility() {
        this.datasetOptions.visible = !this.datasetOptions.visible;
        this.onUpdateOptions.emit(this.datasetOptions);
    }

    public open(content: TemplateRef<any>, className: string = '') {
        this.modalService.open(content, { size: 'lg', windowClass: className });
    }

    public updateColor() {
        this.datasetOptions.color = this.tempColor;
        this.onUpdateOptions.emit(this.datasetOptions);
    }

    private setParameters() {
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
        this.checkDataInTimespan();
    }

    private checkDataInTimespan() {
        if (this.timeInterval && this.dataset) {
            this.hasData = this.timeSrvc.overlaps(
                this.timeInterval,
                new Date(this.dataset.firstValue.timestamp),
                new Date(this.dataset.lastValue.timestamp)
            );
        }
    }
}
