import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { ServicesModule } from './src/services/services.module';

import {
    MultiServiceFilterSelectorComponent,
    ProviderSelectorComponent,
    ProviderSelectorService,
    ServiceFilterSelectorComponent
} from './src/components/selection';

import {
    LabelMapperComponent,
    LabelMapperService,
    GeometryMapViewerComponent
} from './src/components/display';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        HttpClientModule,
        ServicesModule
    ],
    declarations: [
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        LabelMapperComponent,
        GeometryMapViewerComponent
    ],
    entryComponents: [
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        LabelMapperComponent,
        GeometryMapViewerComponent
    ],
    providers: [
        ProviderSelectorService,
        LabelMapperService
    ]
})
export class AppModule {
    ngDoBootstrap() {}
}
