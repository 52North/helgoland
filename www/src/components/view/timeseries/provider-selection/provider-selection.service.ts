import { Injectable } from '@angular/core';
import { Service } from '../../../../model';

const SELECTED_PROVIDER_PARAM = 'selectedTimeseriesProvider';

@Injectable()
export class TimeseriesProviderSelectionService {

    private selectedProvider: Service;

    public setSelectedProvider(provider: Service) {
        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem(SELECTED_PROVIDER_PARAM, JSON.stringify(provider));
        } else {
            this.selectedProvider = provider;
        }
    }

    public getSelectedProvider(): Service {
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
