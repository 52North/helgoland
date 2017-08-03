import { NgModule } from '@angular/core';
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
    LabelMapperService
} from './src/components/display';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        ServicesModule
    ],
    declarations: [
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        LabelMapperComponent
    ],
    entryComponents: [
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        LabelMapperComponent
    ],
    providers: [
        ProviderSelectorService,
        LabelMapperService
    ]
})
export class AppModule {
    ngDoBootstrap() {}
}
