import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import 'rxjs/add/operator/map';

import { ApiV2 } from './interfaces/api-v2.interface';
import {
    Service,
    Category,
    Phenomenon,
    Offering,
    Feature,
    Procedure,
    Platform,
    Station,
    Dataset,
    Timeseries
} from '../../model';

@Injectable()
export class ApiInterface implements ApiV2 {

    constructor(
        private http: HttpClient
    ) { }

    public getServices(apiUrl: string, params?: any): Observable<Service[]> {
        const url = this.createRequestUrl(apiUrl, 'services');
        params.expanded = true;
        return this.requestApi<Service[]>(url, params);
    }

    public getService(id: string, apiUrl: string, params?: any): Observable<Service> {
        throw new Error('Not implemented');
    }

    public getStations(apiUrl: string, params?: any): Observable<Station[]> {
        const url = this.createRequestUrl(apiUrl, 'stations');
        return this.requestApi<Station[]>(url, params);
    }

    public getStation(id: string, apiUrl: string, params?: any): Observable<Station> {
        const url = this.createRequestUrl(apiUrl, 'stations', id);
        return this.requestApi<Station>(url, params);
    }

    public getTimeseries(apiUrl: string, params?: any): Observable<Timeseries[]> {
        const url = this.createRequestUrl(apiUrl, 'timeseries');
        return new Observable<Timeseries[]>((observer: Observer<Timeseries[]>) => {
            this.requestApi<Timeseries[]>(url, params).subscribe(
                (result) => {
                    result.forEach((entry) => {
                        entry.url = apiUrl;
                    });
                    observer.next(result);
                },
                (error) => observer.error(error),
                () => observer.complete()
            );
        });
    }

    public getSingleTimeseries(id: string, apiUrl: string, params?: any): Observable<Timeseries> {
        const url = this.createRequestUrl(apiUrl, 'timeseries', id);
        return new Observable<Timeseries>((observer: Observer<Timeseries>) => {
            this.requestApi<Timeseries>(url, params).subscribe(
                (result) => {
                    result.url = apiUrl;
                    observer.next(result);
                },
                (error) => observer.error(error),
                () => observer.complete());
        });
    }

    public getCategories(apiUrl: string, params?: any): Observable<Category[]> {
        const url = this.createRequestUrl(apiUrl, 'categories');
        return this.requestApi<Category[]>(url, params);
    }

    public getCategory(id: string, apiUrl: string, params?: any): Observable<Category> {
        // const url = this.createRequestUrl(apiUrl, 'categories', id);
        throw new Error('Not implemented');
        // return this.requestApi(url, params)
        //     .map(this.extractData);
    }

    public getPhenomena(apiUrl: string, params?: any): Observable<Phenomenon[]> {
        const url = this.createRequestUrl(apiUrl, 'phenomena');
        return this.requestApi<Phenomenon[]>(url, params);
    }

    public getPhenomenon(id: string, apiUrl: string, params?: any): Observable<Phenomenon> {
        throw new Error('Not implemented');
    }

    public getOfferings(apiUrl: string, params?: any): Observable<Offering[]> {
        const url = this.createRequestUrl(apiUrl, 'offerings');
        return this.requestApi<Offering[]>(url, params);
    }

    public getOffering(id: string, apiUrl: string, params?: any): Observable<Offering> {
        throw new Error('Not implemented');
    }

    public getFeatures(apiUrl: string, params?: any): Observable<Feature[]> {
        const url = this.createRequestUrl(apiUrl, 'features');
        return this.requestApi<Feature[]>(url, params);
    }

    public getFeature(id: string, apiUrl: string, params?: any): Observable<Feature> {
        throw new Error('Not implemented');
    }

    public getProcedures(apiUrl: string, params?: any): Observable<Procedure[]> {
        const url = this.createRequestUrl(apiUrl, 'procedures');
        return this.requestApi<Procedure[]>(url, params);
    }

    public getProcedure(id: string, apiUrl: string, params?: any): Observable<Procedure> {
        throw new Error('Not implemented');
    }

    public getPlatforms(apiUrl: string, params?: any): Observable<Platform[]> {
        const url = this.createRequestUrl(apiUrl, 'platforms');
        return this.requestApi<Platform[]>(url, params);
    }

    public getPlatform(id: string, apiUrl: string, params?: any): Observable<Platform> {
        throw new Error('Not implemented');
    }

    public getDatasets(apiUrl: string, params?: any): Observable<Dataset[]> {
        const url = this.createRequestUrl(apiUrl, 'datasets');
        return this.requestApi<Dataset[]>(url, params);
    }

    public getDataset(id: string, apiUrl: string, params?: any): Observable<Dataset> {
        throw new Error('Not implemented');
    }

    public getGeometries(id: string, apiUrl: string, params?: any): Observable<any> {
        throw new Error('Not implemented');
    }

    private requestApi<T>(url: string, params = {}): Observable<T> {
        let httpParams = new HttpParams();
        Object.getOwnPropertyNames(params).forEach((key) => {
            httpParams = httpParams.set(key, params[key]);
        });
        return this.http.get<T>(url, {
            params: httpParams
        });
    }

    private createRequestUrl(apiUrl: string, endpoint: string, id?: string) {
        // TODO Check whether apiUrl ends with slash
        let requestUrl = apiUrl + endpoint;
        if (id) requestUrl += '/' + id;
        return requestUrl;
    }

}
