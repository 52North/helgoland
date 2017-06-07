import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';

import {
    MultiServiceFilterSelectorComponent
} from './src/components/selection/multi-service-filter-selector.component';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule
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
