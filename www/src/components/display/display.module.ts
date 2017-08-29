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
        FlotOverviewDiagramComponent
    ],
    exports: [
        GeometryMapViewerComponent,
        LabelMapperComponent,
        LegendEntryComponent,
        FlotDiagramComponent,
        FlotOverviewDiagramComponent
    ],
    providers: [
        LabelMapperService
    ]
})
export class DisplayModule { }
