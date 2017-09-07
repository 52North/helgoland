import { Injectable } from '@angular/core';

@Injectable()
export class MapCache {

    private mapCache = {};

    constructor() {
    }

    public getMap(id: string) {
        return this.mapCache[id];
    }

    public setMap(id: string, map: any) {
        this.mapCache[id] = map;
    }

}
