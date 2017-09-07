import { Observable } from 'rxjs/Rx';
import { ApiV1 } from './api-v1.interface';

export interface ApiV2 extends ApiV1 {

    getPlatforms(id: string, apiUrl: string, params?: any): Observable<any>;

    getDatasets(id: string, apiUrl: string, params?: any): Observable<any>;

    getGeometries(id: string, apiUrl: string, params?: any): Observable<any>;

}
