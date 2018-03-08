import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { TimeseriesRouter } from '../../app/timeseries/services/timeseries-router.service';

@Injectable()
export class CustomTimeseriesRouter extends TimeseriesRouter {

    constructor(
        private router: Router
    ) {
        super();
    }

    public navigateToDiagram(): void {
        this.router.navigate(['timeseries/diagram']);
    }
}
