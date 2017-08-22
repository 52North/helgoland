import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    GeometryMapViewerComponent,
    LabelMapperComponent,
    LabelMapperService,
    LegendEntryComponent
} from '.';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        GeometryMapViewerComponent,
        LabelMapperComponent,
        LegendEntryComponent
    ],
    exports: [
        GeometryMapViewerComponent,
        LabelMapperComponent,
        LegendEntryComponent
    ],
    providers: [
        LabelMapperService
    ]
})
export class DisplayModule { }
