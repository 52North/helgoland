import { Injectable } from '@angular/core';
import { Config, Settings } from 'helgoland-toolbox';

@Injectable()
export class SettingsService extends Settings {

    public config: Config;

    constructor() {
        super();
        this.config = require('../../settings.json');
    }

}
