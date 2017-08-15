import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    LocateControlComponent,
    LocateService,
    ZoomControlComponent
} from '.';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LocateControlComponent,
        ZoomControlComponent
    ],
    entryComponents: [
        LocateControlComponent,
        ZoomControlComponent
    ],
    providers: [
        LocateService
    ]
})
export class ControlModule { }
