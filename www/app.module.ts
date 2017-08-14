import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { ServicesModule } from './src/services/services.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
    MultiServiceFilterSelectorComponent,
    ProviderSelectorComponent,
    ProviderSelectorService,
    ServiceFilterSelectorComponent,
    StationMapSelectorComponent,
    ListSelectorComponent,
    ListSelectorService
} from './src/components/selection';

import {
    LabelMapperComponent,
    LabelMapperService,
    GeometryMapViewerComponent
} from './src/components/display';

import {
    ZoomControlComponent,
    LocateControlComponent,
    LocateService
} from './src/components/control';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        HttpClientModule,
        ServicesModule,
        NgbModule.forRoot()
    ],
    declarations: [
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent,
        LabelMapperComponent,
        GeometryMapViewerComponent,
        ZoomControlComponent,
        LocateControlComponent,
        ListSelectorComponent
    ],
    entryComponents: [
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent,
        LabelMapperComponent,
        GeometryMapViewerComponent,
        ZoomControlComponent,
        LocateControlComponent,
        ListSelectorComponent
    ],
    providers: [
        ProviderSelectorService,
        LabelMapperService,
        LocateService,
        ListSelectorService
    ]
})
export class AppModule {
    ngDoBootstrap() {}
}
