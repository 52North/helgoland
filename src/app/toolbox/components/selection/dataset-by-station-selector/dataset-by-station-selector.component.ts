import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Dataset, IDataset } from './../../../model/api/dataset';
import { Station } from './../../../model/api/station';
import { ApiInterface } from './../../../services/api-interface/api-interface.service';

const LOADING_PARAM = 'loading';
const SELECTED_PARAM = 'selected';
const ERROR_PARAM = 'error';
const LOADED_PARAM = 'loaded';

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

    @Output()
    public onSelectionChanged: EventEmitter<Array<Dataset>> = new EventEmitter<Array<Dataset>>();

    constructor(
        private apiInterface: ApiInterface
    ) { }

    public ngOnInit() {
        this.apiInterface.getStation(this.station.properties.id, this.url)
            .subscribe((station) => {
                this.station = station;
                for (const id in this.station.properties.timeseries) {
                    if (this.station.properties.timeseries.hasOwnProperty(id)) {
                        this.station.properties.timeseries[id][LOADING_PARAM] = true;
                        this.station.properties.timeseries[id][SELECTED_PARAM] = true;
                        this.apiInterface.getSingleTimeseries(id, this.url)
                            .subscribe((result) => {
                                this.station.properties.timeseries[id][LOADED_PARAM] = result;
                            }, (error) => {
                                this.station.properties.timeseries[id][ERROR_PARAM] = true;
                            }, () => {
                                this.station.properties.timeseries[id][LOADING_PARAM] = false;
                                this.updateSelection();
                            });
                    }
                }
            });
    }

    public toggle(timeseries: IDataset) {
        timeseries['selected'] = !timeseries['selected'];
        this.updateSelection();
    }

    private updateSelection() {
        const selection: Array<Dataset> = [];
        for (const id in this.station.properties.timeseries) {
            if (this.station.properties.timeseries.hasOwnProperty(id)) {
                if (this.station.properties.timeseries[id][SELECTED_PARAM]) {
                    selection.push(this.station.properties.timeseries[id][LOADED_PARAM]);
                }
            }
        }
        this.onSelectionChanged.emit(selection);
    }

}
