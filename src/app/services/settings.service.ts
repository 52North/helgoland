import { Injectable } from '@angular/core';
import { Settings, SettingsService } from 'helgoland-toolbox';

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {

    constructor() {
        super();
        this.setSettings(require('../../settings.json'));
    }

}
