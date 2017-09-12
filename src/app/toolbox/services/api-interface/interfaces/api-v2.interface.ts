import { Observable } from 'rxjs/Rx';

import { Data } from './../../../model/api/data';
import { IDataset } from './../../../model/api/dataset';
import { DataParameterFilter, ParameterFilter } from './../../../model/api/parameterFilter';
import { Platform } from './../../../model/api/platform';
import { Timespan } from './../../../model/internal/timespan';
import { ApiV1 } from './api-v1.interface';

export interface ApiV2 extends ApiV1 {

    getPlatforms(apiUrl: string, params?: ParameterFilter): Observable<Array<Platform>>;
    getPlatform(id: string, apiUrl: string, params?: ParameterFilter): Observable<Platform>;

    getDatasets(apiUrl: string, params?: ParameterFilter): Observable<Array<IDataset>>;
    getDataset(id: string, apiUrl: string, params?: ParameterFilter): Observable<IDataset>;
    getData<T>(id: string, apiUrl: string, timespan: Timespan, params: DataParameterFilter): Observable<Data<T>>;

    // getGeometries(id: string, apiUrl: string, params?): Observable<>;

}
