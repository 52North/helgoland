import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import 'rxjs/add/operator/filter';

@Injectable()
export class TrajectoriesConditionalRouter {

    constructor(
        private router: Router
    ) {
        this.router.events
            .filter((event: NavigationStart) => event instanceof NavigationStart)
            .subscribe((event: NavigationStart) => this.redirect(event.url));
    }

    private redirect(url: string) {
        // if (url === '/trajectories') {
        //     if (this.trajectoriesSrvc.hasTrajectory()) {
        //         this.router.navigate(['trajectories/view']);
        //     } else {
        //         this.router.navigate(['trajectories/selection']);
        //     }
        // }
    }
}
