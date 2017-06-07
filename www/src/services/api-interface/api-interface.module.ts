import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { ApiInterface } from './api-interface.service';

@NgModule({
    imports: [
        HttpModule
    ],
    declarations: [
    ],
    entryComponents: [
    ],
    providers: [
        ApiInterface
    ]
})
export class ApiInterfaceModule {
}
