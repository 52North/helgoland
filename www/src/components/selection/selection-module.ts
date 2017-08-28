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
    TimespanShiftSelectorComponent
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
        DatasetByStationSelectorComponent,
        TimespanShiftSelectorComponent
    ],
    declarations: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent,
        DatasetByStationSelectorComponent,
        TimespanShiftSelectorComponent
    ],
    exports: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent,
        DatasetByStationSelectorComponent,
        TimespanShiftSelectorComponent
    ],
    providers: [
        ListSelectorService,
        ProviderSelectorService
    ]
})
export class SelectionModule { }
