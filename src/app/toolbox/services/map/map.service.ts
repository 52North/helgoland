import { Injectable } from '@angular/core';

@Injectable()
export class MapCache {

    private mapCache: Map<string, any> = new Map<string, any>();

    constructor() {
    }

    public getMap(id: string): L.Map {
        return this.mapCache.get(id);
    }

    public setMap(id: string, map: L.Map) {
        this.mapCache.set(id, map);
    }

}
