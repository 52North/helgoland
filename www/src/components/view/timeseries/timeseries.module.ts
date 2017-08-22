import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModule } from '../../selection/selection-module';
import { ControlModule } from '../../../components/control';
import { DisplayModule } from '../../../components/display';

import {
    TimeseriesProviderSelectionComponent,
    TimeseriesProviderSelectionService,
    TimeseriesListSelectionComponent,
    TimeseriesMapSelectionComponent,
    TimeseriesDiagramComponent,
    TimeseriesService
} from '.';

@NgModule({
    imports: [
        CommonModule,
        SelectionModule,
        DisplayModule,
        ControlModule,
        NgbModule
    ],
    declarations: [
        TimeseriesProviderSelectionComponent,
        TimeseriesListSelectionComponent,
        TimeseriesMapSelectionComponent,
        TimeseriesDiagramComponent
    ],
    entryComponents: [
        TimeseriesProviderSelectionComponent,
        TimeseriesListSelectionComponent,
        TimeseriesMapSelectionComponent,
        TimeseriesDiagramComponent
    ],
    providers: [
        TimeseriesProviderSelectionService,
        TimeseriesService
    ]
})
export class TimeseriesModule { }
