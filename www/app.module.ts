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

import {
    TimeseriesProviderSelectionComponent,
    TimeseriesProviderSelectionService
} from './src/components/view/timeseries';

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
        ListSelectorComponent,
        TimeseriesProviderSelectionComponent
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
        ListSelectorComponent,
        TimeseriesProviderSelectionComponent
    ],
    providers: [
        ProviderSelectorService,
        LabelMapperService,
        LocateService,
        ListSelectorService,
        TimeseriesProviderSelectionService
    ]
})
export class AppModule {
    ngDoBootstrap() {}
}
