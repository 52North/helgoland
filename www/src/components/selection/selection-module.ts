import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisplayModule } from '../display';
import { UpgradeModule } from '@angular/upgrade/static';

import {
    ListSelectorComponent,
    ListSelectorService,
    MultiServiceFilterSelectorComponent,
    ProviderSelectorComponent,
    ProviderSelectorService,
    ServiceFilterSelectorComponent,
    StationMapSelectorComponent
} from '.';

@NgModule({
    imports: [
        CommonModule,
        UpgradeModule,
        DisplayModule,
        NgbModule.forRoot()
    ],
    entryComponents: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent
    ],
    declarations: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent
    ],
    exports: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent
    ],
    providers: [
        ListSelectorService,
        ProviderSelectorService
    ]
})
export class SelectionModule { }
