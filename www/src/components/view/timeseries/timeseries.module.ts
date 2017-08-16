import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SelectionModule } from '../../selection/selection-module';

import {
    TimeseriesProviderSelectionComponent,
    TimeseriesProviderSelectionService,
    TimeseriesListSelectionComponent,
    TimeseriesService
} from '.';

@NgModule({
    imports: [
        CommonModule,
        SelectionModule,
        NgbModule
    ],
    declarations: [
        TimeseriesProviderSelectionComponent,
        TimeseriesListSelectionComponent
    ],
    entryComponents: [
        TimeseriesProviderSelectionComponent,
        TimeseriesListSelectionComponent
    ],
    providers: [
        TimeseriesProviderSelectionService,
        TimeseriesService
    ]
})
export class TimeseriesModule { }
