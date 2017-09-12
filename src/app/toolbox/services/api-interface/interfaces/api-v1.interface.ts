import { Observable } from 'rxjs/Rx';

import { Category } from './../../../model/api/category';
import { Data } from './../../../model/api/data';
import { Feature } from './../../../model/api/feature';
import { Offering } from './../../../model/api/offering';
import { DataParameterFilter, ParameterFilter } from './../../../model/api/parameterFilter';
import { Phenomenon } from './../../../model/api/phenomenon';
import { Procedure } from './../../../model/api/procedure';
import { Service } from './../../../model/api/service';
import { Station } from './../../../model/api/station';
import { Timeseries } from './../../../model/api/timeseries';
import { Timespan } from './../../../model/internal/timespan';

export interface ApiV1 {

    /**
     * Test
     * @param id
     * @return temp
     */
    getServices(apiUrl: string, params?: ParameterFilter): Observable<Array<Service>>;
    getService(id: string, apiUrl: string, params?: ParameterFilter): Observable<Service>;

    getStations(apiUrl: string, params?: ParameterFilter): Observable<Array<Station>>;
    getStation(id: string, apiUrl: string, params?: ParameterFilter): Observable<Station>;

    getTimeseries(apiUrl: string, params?: ParameterFilter): Observable<Array<Timeseries>>;
    getSingleTimeseries(id: string, apiUrl: string, params?: ParameterFilter): Observable<Timeseries>;

    getTsData<T>(id: string, apiUrl: string, timespan: Timespan, params?: DataParameterFilter): Observable<Data<T>>;

    getCategories(apiUrl: string, params?: ParameterFilter): Observable<Array<Category>>;
    getCategory(id: string, apiUrl: string, params?: ParameterFilter): Observable<Category>;

    getPhenomena(apiUrl: string, params?: ParameterFilter): Observable<Array<Phenomenon>>;
    getPhenomenon(id: string, apiUrl: string, params?: ParameterFilter): Observable<Phenomenon>;

    getOfferings(apiUrl: string, params?: ParameterFilter): Observable<Array<Offering>>;
    getOffering(id: string, apiUrl: string, params?: ParameterFilter): Observable<Offering>;

    getFeatures(apiUrl: string, params?: ParameterFilter): Observable<Array<Feature>>;
    getFeature(id: string, apiUrl: string, params?: ParameterFilter): Observable<Feature>;

    getProcedures(apiUrl: string, params?: ParameterFilter): Observable<Array<Procedure>>;
    getProcedure(id: string, apiUrl: string, params?: ParameterFilter): Observable<Procedure>;

}
