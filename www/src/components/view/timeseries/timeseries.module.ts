import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradeModule } from '@angular/upgrade/static';

import { SelectionModule } from '../../selection/selection-module';

import {
    TimeseriesProviderSelectionComponent,
    TimeseriesProviderSelectionService
} from '.';

@NgModule({
    imports: [ CommonModule, SelectionModule, UpgradeModule ],
    declarations: [
        TimeseriesProviderSelectionComponent
    ],
    entryComponents: [
        TimeseriesProviderSelectionComponent
    ],
    exports: [
        TimeseriesProviderSelectionComponent
    ],
    providers: [
        TimeseriesProviderSelectionService
    ]
})
export class TimeseriesModule { }
