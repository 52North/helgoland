import { Component, Input } from '@angular/core';

import { LocateService } from './locate.service';

@Component({
    selector: 'n52-locate-control',
    templateUrl: './locate.component.html',
    styleUrls: ['./locate.component.scss']
})
export class LocateControlComponent {

    @Input()
    public mapId: string;

    public isToggled = false;

    constructor(
        private locateService: LocateService
    ) { }

    public locateUser() {
        this.isToggled = !this.isToggled;
        if (this.isToggled) {
            this.locateService.startLocate(this.mapId);
        } else {
            this.locateService.stopLocate(this.mapId);
        }
    }
}
