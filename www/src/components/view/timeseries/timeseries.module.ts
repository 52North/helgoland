import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModule } from '../../selection/selection-module';
import { ControlModule } from '../../../components/control';

import {
    TimeseriesProviderSelectionComponent,
    TimeseriesProviderSelectionService,
    TimeseriesListSelectionComponent,
    TimeseriesMapSelectionComponent,
    TimeseriesService
} from '.';

@NgModule({
    imports: [
        CommonModule,
        SelectionModule,
        ControlModule,
        NgbModule
    ],
    declarations: [
        TimeseriesProviderSelectionComponent,
        TimeseriesListSelectionComponent,
        TimeseriesMapSelectionComponent
    ],
    entryComponents: [
        TimeseriesProviderSelectionComponent,
        TimeseriesListSelectionComponent,
        TimeseriesMapSelectionComponent
    ],
    providers: [
        TimeseriesProviderSelectionService,
        TimeseriesService
    ]
})
export class TimeseriesModule { }
