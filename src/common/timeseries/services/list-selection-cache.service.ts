import { Injectable } from '@angular/core';
import { Service, Settings, SettingsService } from '@helgoland/core';

@Injectable()
export class TimeseriesListSelectionCache {
    public selectedService: Service;
    public lastTab: string;

    constructor(private settingsSrvc: SettingsService<Settings>) {
        const service = settingsSrvc.getSettings().datasetApis[0];
        this.selectedService = {
            apiUrl: service.url,
        } as Service;
    }
}
