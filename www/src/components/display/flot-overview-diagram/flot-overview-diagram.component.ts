import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    SimpleChanges,
    DoCheck,
    IterableDiffers,
    IterableDiffer
} from '@angular/core';
import { Time } from '../../../services/time';
import { ApiInterface } from '../../../services/api-interface';
import {
    IDataset,
    Timespan,
    Data
} from '../../../model';

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
