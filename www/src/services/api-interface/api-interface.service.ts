import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { ApiV2 } from './interfaces/api-v2.interface';
import {
    Service,
    Category,
    Phenomena,
    Offering,
    Feature,
    Procedure,
    Parameter
} from '../../model';

@Injectable()
export class ApiInterface implements ApiV2 {

    constructor(
        private http: Http
    ) { }

    public getServices(apiUrl: string, params: any): Observable<Service[]> {
        throw new Error('Not implemented');
    }

    public getService(id: string, apiUrl: string, params: any): Observable<Service> {
        throw new Error('Not implemented');
    }

    public getStations(apiUrl: string, params: any): Observable<any> {
        throw new Error('Not implemented');
    }

    public getStation(id: string, apiUrl: string, params: any): Observable<any> {
        throw new Error('Not implemented');
    }

    public getTimeseries(apiUrl: string, params: any): Observable<any> {
        throw new Error('Not implemented');
    }

    public getTimeserie(id: string, apiUrl: string, params: any): Observable<any> {
        throw new Error('Not implemented');
    }

    public getCategories(apiUrl: string, params: any): Observable<Category[]> {
        const url = this.createRequestUrl(apiUrl, 'categories');
        return this.requestApi(url, params).map(this.extractDataArray);
    }

    public getCategory(id: string, apiUrl: string, params: any): Observable<Category> {
        // const url = this.createRequestUrl(apiUrl, 'categories', id);
        throw new Error('Not implemented');
        // return this.requestApi(url, params)
        //     .map(this.extractData);
    }

    public getPhenomena(apiUrl: string, params: any): Observable<Phenomena[]> {
        const url = this.createRequestUrl(apiUrl, 'phenomena');
        return this.requestApi(url, params).map(this.extractDataArray);
    }

    public getPhenomenon(id: string, apiUrl: string, params: any): Observable<Phenomena> {
        throw new Error('Not implemented');
    }

    public getOfferings(apiUrl: string, params: any): Observable<Offering[]> {
        throw new Error('Not implemented');
    }

    public getOffering(id: string, apiUrl: string, params: any): Observable<Offering> {
        throw new Error('Not implemented');
    }

    public getFeatures(apiUrl: string, params: any): Observable<Feature[]> {
        const url = this.createRequestUrl(apiUrl, 'features');
        return this.requestApi(url, params).map(this.extractDataArray);
    }

    public getFeature(id: string, apiUrl: string, params: any): Observable<Feature> {
        throw new Error('Not implemented');
    }

    public getProcedures(apiUrl: string, params: any): Observable<Procedure[]> {
        const url = this.createRequestUrl(apiUrl, 'procedures');
        return this.requestApi(url, params).map(this.extractDataArray);
    }

    public getProcedure(id: string, apiUrl: string, params: any): Observable<Procedure> {
        throw new Error('Not implemented');
    }

    public getPlatforms(id: string, apiUrl: string, params: any): Observable<any> {
        throw new Error('Not implemented');
    }

    public getDatasets(id: string, apiUrl: string, params: any): Observable<any> {
        throw new Error('Not implemented');
    }

    public getGeometries(id: string, apiUrl: string, params: any): Observable<any> {
        throw new Error('Not implemented');
    }

    private requestApi(requestUrl: string, params: any): Observable<any> {
        return this.http.get(requestUrl, params);
    }

    private createRequestUrl(apiUrl: string, endpoint: string, id?: string) {
        // TODO Check whether apiUrl ends with slash
        let requestUrl = apiUrl + endpoint;
        if (id) requestUrl += '/' + id;
        return requestUrl;
    }

    private extractDataArray(res: Response): Parameter[] {
        // return res.json() as Parameter[] || new Array<Parameter>();
        return new Array<Parameter>();
    }
}
