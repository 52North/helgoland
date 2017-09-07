import { MapCache } from './../../../../services/map/map.service';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'n52-zoom-control',
    templateUrl: './zoom.component.html'
})
export class ZoomControlComponent {

    @Input()
    public mapId: string;

    constructor(
        private mapCache: MapCache
    ) { }

    public zoomIn() {
        this.mapCache.getMap(this.mapId).zoomIn();
    }

    public zoomOut() {
        this.mapCache.getMap(this.mapId).zoomOut();
    }
}
