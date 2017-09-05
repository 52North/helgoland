import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisplayModule } from '../display';
import { UpgradeModule } from '@angular/upgrade/static';
import { PipesModule } from '../../pipes';
import { FormsModule } from '@angular/forms';

import {
    ListSelectorComponent,
    ListSelectorService,
    MultiServiceFilterSelectorComponent,
    ProviderSelectorComponent,
    ProviderSelectorService,
    ServiceFilterSelectorComponent,
    StationMapSelectorComponent,
    DatasetByStationSelectorComponent,
    PredefinedTimespanSelectorComponent,
    TimespanSelectorComponent,
    TimespanShiftSelectorComponent
} from '.';

@NgModule({
    imports: [
        CommonModule,
        UpgradeModule,
        DisplayModule,
        PipesModule,
        FormsModule,
        NgbModule.forRoot()
    ],
    entryComponents: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent,
        DatasetByStationSelectorComponent,
        PredefinedTimespanSelectorComponent,
        TimespanSelectorComponent,
        TimespanShiftSelectorComponent
    ],
    declarations: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent,
        DatasetByStationSelectorComponent,
        PredefinedTimespanSelectorComponent,
        TimespanSelectorComponent,
        TimespanShiftSelectorComponent
    ],
    exports: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent,
        ProviderSelectorComponent,
        ServiceFilterSelectorComponent,
        StationMapSelectorComponent,
        DatasetByStationSelectorComponent,
        PredefinedTimespanSelectorComponent,
        TimespanSelectorComponent,
        TimespanShiftSelectorComponent
    ],
    providers: [
        ListSelectorService,
        ProviderSelectorService
    ]
})
export class SelectionModule { }
