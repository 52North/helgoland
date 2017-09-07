import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

export enum ApiVersion {
    V1,
    V2
}

@Injectable()
export class ApiMapping {

    private cache = {};

    constructor(
        private http: HttpClient
    ) { }

    public getApiVersion(apiUrl: string): Observable<ApiVersion> {
        return new Observable<ApiVersion>((observer: Observer<ApiVersion>) => {
            if (this.cache[apiUrl]) {
                this.confirmVersion(observer, this.cache[apiUrl]);
            } else {
                this.http.get<Array<any>>(apiUrl).subscribe((result) => {
                    let version = ApiVersion.V1;
                    result.forEach((entry) => {
                        if (entry.id === 'platforms') {
                            version = ApiVersion.V2;
                        }
                    });
                    this.confirmVersion(observer, version);
                });
            }
        });
    }

    private confirmVersion(observer: Observer<ApiVersion>, version: ApiVersion) {
        observer.next(version);
        observer.complete();
    }

}
