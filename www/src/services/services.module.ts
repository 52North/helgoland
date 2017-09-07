import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ApiInterface, ApiMapping, CachingInterceptor, HttpCache, LocalHttpCache } from './api-interface';
import { LocalStorage } from './local-storage';
import { MapCache } from './map';
import { Settings } from './settings';
import { Time } from './time';

const CachingInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: CachingInterceptor,
    multi: true
};

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [
    ],
    entryComponents: [
    ],
    providers: [
        { provide: HttpCache, useClass: LocalHttpCache },
        CachingInterceptorProvider,
        ApiInterface,
        ApiMapping,
        Settings,
        MapCache,
        LocalStorage,
        Time
    ]
})
export class ServicesModule {
}
