import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { ApiInterfaceModule } from './src/services/api-interface/api-interface.module';

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
        ApiInterfaceModule
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
