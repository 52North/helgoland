import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    GeometryMapViewerComponent,
    LabelMapperComponent,
    LabelMapperService,
    LegendEntryComponent,
    FlotDiagramComponent
} from '.';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        GeometryMapViewerComponent,
        LabelMapperComponent,
        LegendEntryComponent,
        FlotDiagramComponent
    ],
    exports: [
        GeometryMapViewerComponent,
        LabelMapperComponent,
        LegendEntryComponent,
        FlotDiagramComponent
    ],
    providers: [
        LabelMapperService
    ]
})
export class DisplayModule { }
