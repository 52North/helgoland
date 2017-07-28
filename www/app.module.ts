import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { ApiInterfaceModule } from './src/services/api-interface/api-interface.module';

import {
    MultiServiceFilterSelectorComponent
} from './src/components/selection/multi-service-filter-selector/multi-service-filter-selector.component';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        ApiInterfaceModule
    ],
    declarations: [
        MultiServiceFilterSelectorComponent
    ],
    entryComponents: [
        MultiServiceFilterSelectorComponent
    ]
})
export class AppModule {
    ngDoBootstrap() {}
}
