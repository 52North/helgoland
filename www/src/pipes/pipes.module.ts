import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeysPipe } from './index';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        KeysPipe
    ],
    entryComponents: [
    ],
    exports: [
        KeysPipe
    ]
})
export class PipesModule { }
