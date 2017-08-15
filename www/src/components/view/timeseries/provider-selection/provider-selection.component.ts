import { Component, OnInit } from '@angular/core';
import { TimeseriesProviderSelectionService } from './provider-selection.service';
import { Settings } from '../../../../services/settings';

@Component({
    selector: 'n52-timeseries-provider-selection',
    templateUrl: './provider-selection.component.html'
})
export class TimeseriesProviderSelectionComponent implements OnInit {

    public providerList;
    public providerBlacklist;
    public providerFilter;
    public selectedProvider;

    constructor(
        private settings: Settings,
        private providerCache: TimeseriesProviderSelectionService
    ) { }

    public ngOnInit() {
        this.selectedProvider = this.providerCache.getSelectedProvider();
        this.providerList = this.settings.config['restApiUrls'];
        this.providerBlacklist = this.settings.config['providerBlackList'];
        this.providerFilter = this.createFilter();
    }

    public onProviderSelected(provider) {
        this.selectedProvider = provider;
        this.providerCache.setSelectedProvider(provider);
        // TODO implement with routing
    }

    private createFilter() {
        const filter = {
            valueTypes: 'quantity'
        };
        return filter;
    }
}
