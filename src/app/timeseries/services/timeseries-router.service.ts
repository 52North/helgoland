import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { TimeseriesProviderSelectionService } from './../provider-selection/provider-selection.service';
import { TimeseriesService } from './timeseries.service';

@Injectable()
export class TimeseriesConditionalRouter {

    constructor(
        private router: Router,
        private timeseriesSrvc: TimeseriesService,
        private providerSelection: TimeseriesProviderSelectionService
    ) {
        this.router.events
            .filter((event) => event instanceof NavigationStart)
            .subscribe((event: NavigationStart) => this.redirect(event.url));
    }

    private redirect(url: string) {
        // if (url === '/timeseries') {
        //     if (this.timeseriesSrvc.hasTimeseries()) {
        //         this.router.navigate(['timeseries/diagram']);
        //     } else {
        //         this.router.navigate(['timeseries/map-selection']);
        //     }
        // }
        // if ((url === '/timeseries/map-selection' || url === '/timeseries/list-selection')
        //     && !this.providerSelection.hasSelectedProvider()) {
        //     this.router.navigate(['timeseries/provider']);
        // }
    }
}
