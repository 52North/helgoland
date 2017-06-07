import { Observable } from 'rxjs';
import {
    Category,
    Service,
    Phenomena,
    Offering,
    Feature,
    Procedure
} from '../../../model';

export interface ApiV1 {

    /**
     * Test
     * @param id
     * @return temp
     */
    getServices(apiUrl: string, params: any): Observable<Service[]>;
    getService(id: string, apiUrl: string, params: any): Observable<Service>;

    getStations(apiUrl: string, params: any): Observable<any>;
    getStation(id: string, apiUrl: string, params: any): Observable<any>;

    getTimeseries(apiUrl: string, params: any): Observable<any>;
    getTimeserie(id: string, apiUrl: string, params: any): Observable<any>;

    getCategories(apiUrl: string, params: any): Observable<Category[]>;
    getCategory(id: string, apiUrl: string, params: any): Observable<Category>;

    getPhenomena(apiUrl: string, params: any): Observable<Phenomena[]>;
    getPhenomenon(id: string, apiUrl: string, params: any): Observable<Phenomena>;

    getOfferings(apiUrl: string, params: any): Observable<Offering[]>;
    getOffering(id: string, apiUrl: string, params: any): Observable<Offering>;

    getFeatures(apiUrl: string, params: any): Observable<Feature[]>;
    getFeature(id: string, apiUrl: string, params: any): Observable<Feature>;

    getProcedures(apiUrl: string, params: any): Observable<Procedure[]>;
    getProcedure(id: string, apiUrl: string, params: any): Observable<Procedure>;

}
