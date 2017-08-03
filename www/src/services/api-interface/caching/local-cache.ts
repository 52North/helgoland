import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpCache } from './caching-interceptor';

@Injectable()
export class LocalHttpCache extends HttpCache {

    cache: any = {};

    get(req: HttpRequest<any>): HttpResponse<any> {
        if (this.cache[req.urlWithParams]) {
            return this.cache[req.urlWithParams];
        }
        return null;
    }

    put(req: HttpRequest<any>, resp: HttpResponse<any>) {
        this.cache[req.urlWithParams] = resp;
    }
}

export let LocalHttpCacheProvider = {
    provide: HttpCache,
    useClass: LocalHttpCache
};
