import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Feature, Offering, Phenomenon, Procedure, Service, DatasetApiInterface } from '@helgoland/core';
import { PermalinkService } from '@helgoland/permalink';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { ProfilesSelectionCache } from './selection.service';

const PROVIDER_URL_PARAM = 'url';
const PROVIDER_ID_PARAM = 'id';
const OFFERING_PARAM = 'offering';
const PHENOMENON_PARAM = 'phenomenon';
const PROCEDURE_PARAM = 'procedure';
const FEATURE_PARAM = 'feature';

export class ProfilesSelection {
    public selectedProvider: Service;
    public selectedOffering: Offering;
    public selectedPhenomenon: Phenomenon;
    public selectedProcedure: Procedure;
    public selectedFeature: Feature;
}

@Injectable()
export class ProfilesSelectionPermalink extends PermalinkService<Observable<ProfilesSelection>> {

    constructor(
        private selectionCache: ProfilesSelectionCache,
        private activatedRoute: ActivatedRoute,
        private api: DatasetApiInterface
    ) {
        super();
    }

    public generatePermalink(): string {
        let parameter = '';
        if (this.selectionCache.selectedProvider) {
            parameter += PROVIDER_URL_PARAM + '=' + this.selectionCache.selectedProvider.apiUrl;
            parameter += '&' + PROVIDER_ID_PARAM + '=' + this.selectionCache.selectedProvider.id;
            if (this.selectionCache.selectedOffering) {
                parameter += '&' + OFFERING_PARAM + '=' + this.selectionCache.selectedOffering.id;
                if (this.selectionCache.selectedPhenomenon) {
                    parameter += '&' + PHENOMENON_PARAM + '=' + this.selectionCache.selectedPhenomenon.id;
                    if (this.selectionCache.selectedProcedure) {
                        parameter += '&' + PROCEDURE_PARAM + '=' + this.selectionCache.selectedProcedure.id;
                        if (this.selectionCache.selectedFeature) {
                            parameter += '&' + FEATURE_PARAM + '=' + this.selectionCache.selectedFeature.id;
                        }
                    }
                }
            }
        }
        if (parameter) {
            return this.createBaseUrl() + '?' + parameter;
        } else {
            return this.createBaseUrl();
        }
    }

    public validatePeramlink(): Observable<ProfilesSelection> {
        return new Observable((observer: Observer<ProfilesSelection>) => {
            this.activatedRoute.queryParams.subscribe((params: Params) => {
                const result = new ProfilesSelection();
                if (params[PROVIDER_URL_PARAM] && params[PROVIDER_ID_PARAM]) {
                    const url = params[PROVIDER_URL_PARAM];
                    this.api.getService(params[PROVIDER_ID_PARAM], url)
                        .subscribe(res => {
                            result.selectedProvider = res;
                            if (params[OFFERING_PARAM]) {
                                this.api.getOffering(params[OFFERING_PARAM], url)
                                    .subscribe(offering => {
                                        result.selectedOffering = offering;
                                        if (params[PHENOMENON_PARAM]) {
                                            this.api.getPhenomenon(params[PHENOMENON_PARAM], url)
                                                .subscribe(phenomenon => {
                                                    result.selectedPhenomenon = phenomenon;
                                                    if (params[PROCEDURE_PARAM]) {
                                                        this.api.getProcedure(params[PROCEDURE_PARAM], url)
                                                            .subscribe(procedure => {
                                                                result.selectedProcedure = procedure;
                                                                if (params[FEATURE_PARAM]) {
                                                                    this.api.getFeature(params[FEATURE_PARAM], url)
                                                                        .subscribe(feature => {
                                                                            result.selectedFeature = feature;
                                                                            this.completeObserver(observer, result);
                                                                        });
                                                                } else {
                                                                    this.completeObserver(observer, result);
                                                                }
                                                            });
                                                    } else {
                                                        this.completeObserver(observer, result);
                                                    }
                                                });
                                        } else {
                                            this.completeObserver(observer, result);
                                        }
                                    });
                            } else {
                                this.completeObserver(observer, result);
                            }
                        });
                } else {
                    this.completeObserver(observer, result);
                }
            });
        });
    }

    private completeObserver(observer: Observer<ProfilesSelection>, result: ProfilesSelection) {
        observer.next(result);
        observer.complete();
    }
}
