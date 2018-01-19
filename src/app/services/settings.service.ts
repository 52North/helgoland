import { Injectable } from '@angular/core';
import { Settings, SettingsService } from 'helgoland-toolbox';
import { settings } from '../../environments/environment';

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {

    constructor() {
        super();
        this.setSettings(settings);
    }

}
