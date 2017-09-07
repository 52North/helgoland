import { Injectable } from '@angular/core';

import { Config } from './../../model/config/config';

@Injectable()
export class Settings {

    public config: Config;

    constructor() {
        this.config = require('../../../../settings.json');
    }

}
