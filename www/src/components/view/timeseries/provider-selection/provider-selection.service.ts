import { Injectable } from '@angular/core';
import { LocalStorage } from '../../../../services/local-storage';
import { Service } from '../../../../model';

const SELECTED_PROVIDER_PARAM = 'selectedTimeseriesProvider';

@Injectable()
export class TimeseriesProviderSelectionService {

    private selectedProvider: Service;

    constructor(
        private localStorage: LocalStorage
    ) { }

    public setSelectedProvider(provider: Service) {
        if (!this.localStorage.save(SELECTED_PROVIDER_PARAM, provider)) {
            this.selectedProvider = provider;
        }
    }

    public getSelectedProvider(): Service {
        const provider = this.localStorage.load(SELECTED_PROVIDER_PARAM);
        return provider ? provider : this.selectedProvider;
    }

}
