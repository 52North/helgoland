import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BoolTogglerComponent } from './bool-toggler/bool-toggler.component';
import { LocateControlComponent } from './map/locate/locate.component';
import { LocateService } from './map/locate/locate.service';
import { ZoomControlComponent } from './map/zoom/zoom.component';
import { StringTogglerComponent } from './string-toggler/string-toggler.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LocateControlComponent,
        ZoomControlComponent,
        StringTogglerComponent,
        BoolTogglerComponent
    ],
    entryComponents: [
        LocateControlComponent,
        ZoomControlComponent,
        StringTogglerComponent,
        BoolTogglerComponent
    ],
    exports: [
        LocateControlComponent,
        ZoomControlComponent,
        StringTogglerComponent,
        BoolTogglerComponent
    ],
    providers: [
        LocateService
    ]
})
export class ControlModule { }
