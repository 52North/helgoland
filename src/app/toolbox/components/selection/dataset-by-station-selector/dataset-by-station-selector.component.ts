import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiInterface, Station, Timeseries } from 'helgoland-toolbox';

class ExtendedTimeseries extends Timeseries {
    selected: boolean;
}

@Component({
    selector: 'n52-dataset-by-station-selector',
    templateUrl: './dataset-by-station-selector.component.html',
    styleUrls: ['./dataset-by-station-selector.component.scss']
})
export class DatasetByStationSelectorComponent implements OnInit {

    @Input()
    public station: Station;

    @Input()
    public url: string;

    @Input()
    public defaultSelected = false;

    @Output()
    public onSelectionChanged: EventEmitter<Array<Timeseries>> = new EventEmitter<Array<Timeseries>>();

    public timeseriesList: Array<ExtendedTimeseries> = new Array<ExtendedTimeseries>();

    public counter: number;

    constructor(
        private apiInterface: ApiInterface
    ) { }

    public ngOnInit() {
        this.apiInterface.getStation(this.station.properties.id, this.url)
            .subscribe((station) => {
                this.station = station;
                this.counter = 0;
                for (const id in this.station.properties.timeseries) {
                    if (this.station.properties.timeseries.hasOwnProperty(id)) {
                        this.counter++;
                        this.apiInterface.getSingleTimeseries(id, this.url)
                            .subscribe((result) => {
                                const ts = result as ExtendedTimeseries;
                                ts.selected = this.defaultSelected;
                                this.timeseriesList.push(ts);
                                this.updateSelection();
                                this.counter--;
                            }, (error) => {
                                this.counter--;
                            });
                    }
                }
            });
    }

    public toggle(timeseries: ExtendedTimeseries) {
        timeseries.selected = !timeseries.selected;
        this.updateSelection();
    }

    private updateSelection() {
        const selection = this.timeseriesList.filter((entry) => entry.selected);
        this.onSelectionChanged.emit(selection);
    }

}
