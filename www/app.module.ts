import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { ApiInterfaceModule } from './src/services/api-interface/api-interface.module';

import {
    MultiServiceFilterSelectorComponent,
    ProviderSelectorComponent,
    ProviderSelectorService
} from './src/components/selection';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        ApiInterfaceModule
    ],
    declarations: [
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent
    ],
    entryComponents: [
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent
    ],
    providers: [
        ProviderSelectorService
    ]
})
export class AppModule {
    ngDoBootstrap() {}
}
