import { Component, OnInit } from '@angular/core';
import { TimeseriesProviderSelectionService } from '../provider-selection/provider-selection.service';
import { TimeseriesService } from '../services/timeseries.service';

@Component({
    selector: 'n52-timeseries-list-selection',
    templateUrl: './list-selection.component.html'
})
export class TimeseriesListSelectionComponent implements OnInit {

    public categoryParams = [{
        type: 'category',
        header: 'Kategorie'
    }, {
        type: 'feature',
        header: 'Station'
    }, {
        type: 'phenomenon',
        header: 'Phänomen'
    }, {
        type: 'procedure',
        header: 'Sensor'
    }];

    public stationParams = [{
        type: 'feature',
        header: 'Station'
    }, {
        type: 'category',
        header: 'Kategorie'
    }, {
        type: 'phenomenon',
        header: 'Phänomen'
    }, {
        type: 'procedure',
        header: 'Sensor'
    }];

    public phenomenonParams = [{
        type: 'phenomenon',
        header: 'Phänomen'
    }, {
        type: 'category',
        header: 'Kategorie'
    }, {
        type: 'feature',
        header: 'Station'
    }, {
        type: 'procedure',
        header: 'Sensor'
    }];

    public procedureParams = [{
        type: 'procedure',
        header: 'Sensor'
    }, {
        type: 'feature',
        header: 'Station'
    }, {
        type: 'phenomenon',
        header: 'Phänomen'
    }, {
        type: 'category',
        header: 'Kategorie'
    }];

    public providerList;

    constructor(
        private providerCache: TimeseriesProviderSelectionService,
        private timeseriesService: TimeseriesService
    ) { }

    public ngOnInit() {
        const provider = this.providerCache.getSelectedProvider();
        if (provider) {
            this.providerList = [
                {
                    url: provider.providerUrl,
                    serviceID: provider.id
                }
            ];
        }
    }

    public onDatasetSelected(datasetList, url) {
        if (datasetList instanceof Array && datasetList.length === 1) {
            this.timeseriesService.addTimeseries(datasetList[0], url);
            // TODO add navigation to diagram
        } else {
            console.error('datasetList is no array or has not the length of 1');
        }
    }

}
