import { Injectable } from '@angular/core';

const SELECTED_PROVIDER_PARAM = 'selectedTimeseriesProvider';

@Injectable()
export class TimeseriesProviderSelectionService {

    private selectedProvider;

    public setSelectedProvider(provider) {
        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem(SELECTED_PROVIDER_PARAM, JSON.stringify(provider));
        } else {
            this.selectedProvider = provider;
        }
    }

    public getSelectedProvider() {
        if (typeof(Storage) !== 'undefined') {
            const provider = localStorage.getItem(SELECTED_PROVIDER_PARAM);
            if (provider) {
                return JSON.parse(provider);
            }
        } else {
            return this.selectedProvider;
        }
    }

}
