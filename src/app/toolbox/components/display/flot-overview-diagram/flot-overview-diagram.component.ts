import { ApiInterface } from './../../../services/api-interface/api-interface.service';
import { Time } from './../../../services/time/time.service';
import { Timespan } from './../../../model/internal/timespan';
import { IDataset } from './../../../model/api/dataset';
import { Data } from './../../../model/api/data';
import {
    Component,
    DoCheck,
    EventEmitter,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';

@Component({
    selector: 'n52-flot-overview-diagram',
    templateUrl: './flot-overview-diagram.component.html',
    styleUrls: ['./flot-overview-diagram.component.scss']
})
export class FlotOverviewDiagramComponent implements DoCheck, OnInit, OnChanges {

    @Input()
    public datasets: Array<IDataset>;

    @Input()
    public timespan: Timespan;

    @Input()
    public rangefactor: number;

    @Input()
    public options: any;

    @Output()
    public onTimespanChanged: EventEmitter<Timespan> = new EventEmitter();

    private differDatasets: IterableDiffer<IDataset>;
    public data: Array<Data<[2]>>;
    public overviewTimespan: Timespan;
    private init = false;

    constructor(
        private timeSrvc: Time,
        private api: ApiInterface,
        private differs: IterableDiffers
    ) {
        this.differDatasets = this.differs.find([]).create();
    }

    public ngOnInit() {
        this.rangefactor = this.rangefactor || 1;
        this.calculateOverviewRange();
        this.init = true;
    }

    public ngDoCheck() {
        const changes = this.differDatasets.diff(this.datasets);
        if (changes && this.init) {
            this.calculateOverviewRange();
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes && this.init) {
            this.calculateOverviewRange();
        }
    }

    public timeChanged(timespan: Timespan) {
        this.onTimespanChanged.emit(timespan);
    }

    private calculateOverviewRange() {
        this.overviewTimespan = this.timeSrvc.getBufferedTimespan(this.timespan, this.rangefactor);
        this.options.selection.range = {
            from: this.timespan.from.getTime(),
            to: this.timespan.to.getTime()
        };
        this.data = [];
        this.datasets.forEach((entry, idx) => {
            this.data[idx] = null;
            this.api.getTsData<[2]>(entry.id, entry.url, this.overviewTimespan, { format: 'flot' }).subscribe((result) => {
                this.data[idx] = result;
            });
        });
    }
}
