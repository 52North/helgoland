import { Injectable } from '@angular/core';
import { LocalStorage, Service } from 'helgoland-toolbox';

const SELECTED_PROVIDER_PARAM = 'selectedTimeseriesProvider';

@Injectable()
export class TimeseriesProviderSelectionService {

    private selectedProvider: Service = null;

    constructor(
        private localStorage: LocalStorage
    ) { }

    public setSelectedProvider(provider: Service) {
        this.localStorage.save(SELECTED_PROVIDER_PARAM, provider);
        this.selectedProvider = provider;
    }

    public getSelectedProvider(): Service {
        const provider = this.localStorage.load<Service>(SELECTED_PROVIDER_PARAM);
        return provider ? provider : this.selectedProvider;
    }

}
