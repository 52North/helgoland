import 'rxjs/add/operator/map';

import { HttpClient, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { deserialize, deserializeArray } from 'class-transformer';
import * as moment from 'moment';
import { Observable, Observer } from 'rxjs/Rx';

import { Category } from './../../model/api/category';
import { Data } from './../../model/api/data';
import { Dataset } from './../../model/api/dataset/dataset';
import { Feature } from './../../model/api/feature';
import { Offering } from './../../model/api/offering';
import { DataParameterFilter, ParameterFilter } from './../../model/api/parameterFilter';
import { Phenomenon } from './../../model/api/phenomenon';
import { Platform } from './../../model/api/platform';
import { Procedure } from './../../model/api/procedure';
import { Service } from './../../model/api/service';
import { Station } from './../../model/api/station';
import { Timeseries } from './../../model/api/timeseries';
import { Timespan } from './../../model/internal/timespan';
import { ApiV2 } from './interfaces/api-v2.interface';

export class UriParameterCoder implements HttpParameterCodec {

    public encodeKey(key: string): string {
        return encodeURIComponent(key);
    }

    public encodeValue(value: string): string {
        return encodeURIComponent(value);
    }

    public decodeKey(key: string): string {
        return key;
    }

    public decodeValue(value: string): string {
        return value;
    }
}

@Injectable()
export class ApiInterface implements ApiV2 {

    constructor(
        private http: HttpClient
    ) { }

    public getServices(apiUrl: string, params?: ParameterFilter): Observable<Service[]> {
        const url = this.createRequestUrl(apiUrl, 'services');
        params.expanded = true;
        return this.requestApi<Service[]>(url, params)
            .map(result => {
                result.forEach(entry => entry.providerUrl = apiUrl);
                return result;
            });
    }

    public getService(id: string, apiUrl: string, params?: ParameterFilter): Observable<Service> {
        const url = this.createRequestUrl(apiUrl, 'services', id);
        return this.requestApi<Service>(url, params)
            .map(result => {
                result.providerUrl = apiUrl;
                return result;
            });
    }

    public getStations(apiUrl: string, params?: ParameterFilter): Observable<Station[]> {
        const url = this.createRequestUrl(apiUrl, 'stations');
        return this.requestApi<Station[]>(url, params);
    }

    public getStation(id: string, apiUrl: string, params?: ParameterFilter): Observable<Station> {
        const url = this.createRequestUrl(apiUrl, 'stations', id);
        return this.requestApi<Station>(url, params);
    }

    public getTimeseries(apiUrl: string, params?: ParameterFilter): Observable<Timeseries[]> {
        const url = this.createRequestUrl(apiUrl, 'timeseries');
        return new Observable<Timeseries[]>((observer: Observer<Timeseries[]>) => {
            this.requestApiTexted(url, params).subscribe(
                (result) => {
                    const timeseriesList = deserializeArray<Timeseries>(Timeseries, result);
                    timeseriesList.forEach((entry) => {
                        entry.url = apiUrl;
                    });
                    observer.next(timeseriesList);
                },
                (error) => observer.error(error),
                () => observer.complete()
            );
        });
    }

    public getSingleTimeseries(id: string, apiUrl: string, params?: ParameterFilter): Observable<Timeseries> {
        const url = this.createRequestUrl(apiUrl, 'timeseries', id);
        return this.requestApiTexted(url, params).map((result) => {
            const timeseries = deserialize<Timeseries>(Timeseries, result);
            timeseries.url = apiUrl;
            return timeseries;
        });
    }

    public getTsData<T>(id: string, apiUrl: string, timespan: Timespan, params: DataParameterFilter = {}): Observable<Data<T>> {
        const url = this.createRequestUrl(apiUrl, 'timeseries', id) + '/getData';
        params.timespan = this.createRequestTimespan(timespan);
        return this.requestApi<Data<T>>(url, params);
    }

    private createRequestTimespan(timespan: Timespan): string {
        return encodeURI(moment(timespan.from).format() + '/' + moment(timespan.to).format());
    }

    public getCategories(apiUrl: string, params?: ParameterFilter): Observable<Category[]> {
        const url = this.createRequestUrl(apiUrl, 'categories');
        return this.requestApi<Category[]>(url, params);
    }

    public getCategory(id: string, apiUrl: string, params?: ParameterFilter): Observable<Category> {
        // const url = this.createRequestUrl(apiUrl, 'categories', id);
        throw new Error('Not implemented');
        // return this.requestApi(url, params)
        //     .map(this.extractData);
    }

    public getPhenomena(apiUrl: string, params?: ParameterFilter): Observable<Phenomenon[]> {
        const url = this.createRequestUrl(apiUrl, 'phenomena');
        return this.requestApi<Phenomenon[]>(url, params);
    }

    public getPhenomenon(id: string, apiUrl: string, params?: ParameterFilter): Observable<Phenomenon> {
        const url = this.createRequestUrl(apiUrl, 'phenomena', id);
        return this.requestApi<Phenomenon>(url, params);
    }

    public getOfferings(apiUrl: string, params?: ParameterFilter): Observable<Offering[]> {
        const url = this.createRequestUrl(apiUrl, 'offerings');
        return this.requestApi<Offering[]>(url, params);
    }

    public getOffering(id: string, apiUrl: string, params?: ParameterFilter): Observable<Offering> {
        const url = this.createRequestUrl(apiUrl, 'offerings', id);
        return this.requestApi<Offering>(url, params);
    }

    public getFeatures(apiUrl: string, params?: ParameterFilter): Observable<Feature[]> {
        const url = this.createRequestUrl(apiUrl, 'features');
        return this.requestApi<Feature[]>(url, params);
    }

    public getFeature(id: string, apiUrl: string, params?: ParameterFilter): Observable<Feature> {
        const url = this.createRequestUrl(apiUrl, 'features', id);
        return this.requestApi<Feature>(url, params);
    }

    public getProcedures(apiUrl: string, params?: ParameterFilter): Observable<Procedure[]> {
        const url = this.createRequestUrl(apiUrl, 'procedures');
        return this.requestApi<Procedure[]>(url, params);
    }

    public getProcedure(id: string, apiUrl: string, params?: ParameterFilter): Observable<Procedure> {
        const url = this.createRequestUrl(apiUrl, 'procedures', id);
        return this.requestApi<Procedure>(url, params);
    }

    public getPlatforms(apiUrl: string, params?: ParameterFilter): Observable<Platform[]> {
        const url = this.createRequestUrl(apiUrl, 'platforms');
        return this.requestApi<Platform[]>(url, params);
    }

    public getPlatform(id: string, apiUrl: string, params?: ParameterFilter): Observable<Platform> {
        const url = this.createRequestUrl(apiUrl, 'platforms');
        return this.requestApi<Platform>(url, params);
    }

    public getDatasets(apiUrl: string, params?: ParameterFilter): Observable<Dataset[]> {
        const url = this.createRequestUrl(apiUrl, 'datasets');
        return this.requestApi<Dataset[]>(url, params).map((list) => list.map((entry) => this.prepareDataset(entry, apiUrl)));
    }

    public getDataset(id: string, apiUrl: string, params?: ParameterFilter): Observable<Dataset> {
        const url = this.createRequestUrl(apiUrl, 'datasets', id);
        return this.requestApi<Dataset>(url, params).map((res) => this.prepareDataset(res, apiUrl));
    }

    public getData<T>(id: string, apiUrl: string, timespan: Timespan, params: DataParameterFilter = {}): Observable<Data<T>> {
        const url = this.createRequestUrl(apiUrl, 'datasets', id) + '/data';
        params.timespan = this.createRequestTimespan(timespan);
        return this.requestApi<Data<T>>(url, params);
    }

    // public getGeometries(id: string, apiUrl: string, params?): Observable<> {
    //     throw new Error('Not implemented');
    // }

    private requestApi<T>(url: string, params: ParameterFilter = {}): Observable<T> {
        let httpParams = new HttpParams({
            encoder: new UriParameterCoder()
        });
        Object.getOwnPropertyNames(params).forEach((key) => httpParams = httpParams.set(key, params[key]));
        return this.http.get<T>(url, { params: httpParams });
    }

    private requestApiTexted(url: string, params: ParameterFilter = {}): Observable<string> {
        let httpParams = new HttpParams();
        Object.getOwnPropertyNames(params).forEach((key) => httpParams = httpParams.set(key, params[key]));
        return this.http.get(url, {
            params: httpParams,
            responseType: 'text'
        });
    }

    private createRequestUrl(apiUrl: string, endpoint: string, id?: string) {
        // TODO Check whether apiUrl ends with slash
        let requestUrl = apiUrl + endpoint;
        if (id) { requestUrl += '/' + id; }
        return requestUrl;
    }


    private prepareDataset(dataset: Dataset, apiUrl: string) {
        dataset.url = apiUrl;
        if (dataset.seriesParameters) {
            dataset.parameters = dataset.seriesParameters;
            delete dataset.seriesParameters;
        }
        return dataset;
    }
}
