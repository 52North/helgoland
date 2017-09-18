import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class PermalinkService {

    constructor(
        private router: Router,
        private location: Location
    ) { }

    public createBaseUrl() {
        const url = window.location.href;
        if (url.indexOf('?') !== -1) {
            return url.substring(0, url.indexOf('?'));
        } else {
            return url;
        }
    }

}
