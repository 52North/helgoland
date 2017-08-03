import { Injectable } from '@angular/core';
import { Config } from '../../model';

@Injectable()
export class Settings {

    public config: Config;

    constructor() {
        this.config = require('../../../settings.json');
    }

}
