import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorage {

    private localStorageEnabled = false;

    constructor() {
        if (typeof(Storage) !== 'undefined') {
            this.localStorageEnabled = true;
        }
    }

    public save(param: string, object: any): boolean {
        if (this.localStorageEnabled) {
            localStorage.setItem(param, JSON.stringify(object));
            return true;
        }
        return false;
    }

    public load(param: string): any {
        if (this.localStorageEnabled) {
            const result = localStorage.getItem(param);
            if (result) {
                return JSON.parse(result);
            }
            return null;
        }
    }

    public loadTextual(param: string): string {
        if (this.localStorageEnabled) {
            return localStorage.getItem(param);
        }
        return null;
    }

}
