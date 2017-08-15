import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    GeometryMapViewerComponent,
    LabelMapperComponent,
    LabelMapperService
} from '.';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        GeometryMapViewerComponent,
        LabelMapperComponent,
    ],
    exports: [
        GeometryMapViewerComponent,
        LabelMapperComponent
    ],
    providers: [
        LabelMapperService
    ]
})
export class DisplayModule { }
