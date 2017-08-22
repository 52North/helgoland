import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { ApiInterface, CachingInterceptor, LocalHttpCache, HttpCache, ApiMapping } from './api-interface';
import { Settings } from './settings';
import { MapCache } from './map';
import { LocalStorage } from './local-storage';

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
        LocalStorage
    ]
})
export class ServicesModule {
}
