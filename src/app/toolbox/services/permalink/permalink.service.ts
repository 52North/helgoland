import { Injectable } from '@angular/core';

@Injectable()
export class PermalinkService {

    constructor() { }

    public createBaseUrl() {
        const url = window.location.href;
        if (url.indexOf('?') !== -1) {
            return url.substring(0, url.indexOf('?'));
        } else {
            return url;
        }
    }

}
