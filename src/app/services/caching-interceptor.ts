import 'rxjs/add/operator/do';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

export abstract class HttpCache {
    /**
     * Returns a cached response, if any, or null if not present.
     */
    public abstract get(req: HttpRequest<any>): HttpResponse<any> | null;

    /**
     * Adds or updates the response in the cache.
     */
    public abstract put(req: HttpRequest<any>, resp: HttpResponse<any>): void;
}

export class OnGoingHttpCache {

    private cache: { [key: string]: { request: Observable<HttpEvent<any>> } } = {};

    public has(req: HttpRequest<any>): boolean {
        return this.cache[req.urlWithParams] !== undefined;
    }

    public set(req: HttpRequest<any>, request: Observable<HttpEvent<any>>): void {
        this.cache[req.urlWithParams] = {
            request
        };
    }

    public observe(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        return this.cache[req.urlWithParams].request;
    }

    public clear(req: HttpRequest<any>) {
        delete this.cache[req.urlWithParams];
    }
}

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    constructor(
        private cache: HttpCache,
        private ongoingCache: OnGoingHttpCache
    ) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Before doing anything, it's important to only cache GET requests.
        // Skip this interceptor if the request method isn't GET.
        if (req.method !== 'GET') {
            return next.handle(req);
        }

        // First, check the cache to see if this request exists.
        const cachedResponse = this.cache.get(req);
        if (cachedResponse) {
            // A cached response exists. Serve it instead of forwarding
            // the request to the next handler.
            return Observable.of(cachedResponse);
        }

        // check if the same request is still in the pipe
        if (this.ongoingCache.has(req)) {
            return this.ongoingCache.observe(req);
        } else {
            // No cached response exists. Go to the network, and cache
            // the response when it arrives.
            return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
                const temp = next.handle(req).share();
                temp.subscribe((res) => {
                    if (res instanceof HttpResponse) {
                        this.cache.put(req, res);
                        this.ongoingCache.clear(req);
                        observer.next(res);
                        observer.complete();
                    }
                });
                this.ongoingCache.set(req, temp);
            });
        }
    }
}
