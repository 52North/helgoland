import { ApiInterface } from './../../../services/api-interface/api-interface.service';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

@Injectable()
export class ProviderSelectorService {

    constructor(
        private apiInterface: ApiInterface
    ) { }

    public fetchProvidersOfAPI(url: string, blacklist: Array<any>, filter: any): Observable<Array<any>> {
        return new Observable<Array<any>>((observer: Observer<Array<any>>) => {
            this.apiInterface.getServices(url, filter)
                .subscribe((providers) => {
                    if (providers && providers instanceof Array) {
                        const usableProviders = providers.map((provider) => {
                            if (!this.isServiceBlacklisted(provider.id, url, blacklist)) {
                                provider.providerUrl = url;
                                return provider;
                            }
                        });
                        observer.next(usableProviders);
                        observer.complete();
                    }
                }, (error) => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    private isServiceBlacklisted(serviceID: string, url: string, blacklist: Array<any>): boolean {
        let isBlacklisted = false;
        blacklist.forEach((entry) => {
            if (entry.serviceID === serviceID && entry.apiUrl === url) {
                isBlacklisted = true;
            }
        });
        return isBlacklisted;
    }
}
