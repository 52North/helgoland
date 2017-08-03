import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { ApiInterface } from './api-interface/api-interface.service';
import { Settings } from './settings/settings.service';

@NgModule({
    imports: [
        HttpModule
    ],
    declarations: [
    ],
    entryComponents: [
    ],
    providers: [
        ApiInterface,
        Settings
    ]
})
export class ServicesModule {
}
