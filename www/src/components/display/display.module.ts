import { DThreeDiagramComponent } from './d-three-diagram/d-three-diagram.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    GeometryMapViewerComponent,
    LabelMapperComponent,
    LabelMapperService,
    LegendEntryComponent,
    FlotDiagramComponent,
    FlotOverviewDiagramComponent
} from '.';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        GeometryMapViewerComponent,
        LabelMapperComponent,
        LegendEntryComponent,
        FlotDiagramComponent,
        FlotOverviewDiagramComponent,
        DThreeDiagramComponent
    ],
    exports: [
        GeometryMapViewerComponent,
        LabelMapperComponent,
        LegendEntryComponent,
        FlotDiagramComponent,
        FlotOverviewDiagramComponent,
        DThreeDiagramComponent
    ],
    providers: [
        LabelMapperService
    ]
})
export class DisplayModule { }
