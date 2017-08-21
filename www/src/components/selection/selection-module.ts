import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisplayModule } from '../display';
import { UpgradeModule } from '@angular/upgrade/static';
import { PipesModule } from '../../pipes';

import {
    ListSelectorComponent,
    ListSelectorService,
    MultiServiceFilterSelectorComponent,
    ProviderSelectorComponent,
    ProviderSelectorService,
    ServiceFilterSelectorComponent,
    StationMapSelectorComponent,
    DatasetByStationSelectorComponent,
} from '.';

@NgModule({
    imports: [
        CommonModule,
        UpgradeModule,
        DisplayModule,
        PipesModule,
        NgbModule.forRoot()
    ],
    entryComponents: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent,
        DatasetByStationSelectorComponent
    ],
    declarations: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent,
        DatasetByStationSelectorComponent
    ],
    exports: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent,
        DatasetByStationSelectorComponent
    ],
    providers: [
        ListSelectorService,
        ProviderSelectorService
    ]
})
export class SelectionModule { }
