import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { LocateControlComponent } from './components/control/map/locate/locate.component';
import { LocateService } from './components/control/map/locate/locate.service';
import { ZoomControlComponent } from './components/control/map/zoom/zoom.component';
import { LabelMapperComponent } from './components/display/label-mapper/label-mapper.component';
import { LabelMapperService } from './components/display/label-mapper/label-mapper.service';
import {
    DatasetByStationSelectorComponent,
} from './components/selection/dataset-by-station-selector/dataset-by-station-selector.component';
import { ProviderSelectorComponent } from './components/selection/provider-selector/provider-selector.component';
import { ProviderSelectorService } from './components/selection/provider-selector/provider-selector.service';
import {
    ServiceFilterSelectorComponent,
} from './components/selection/service-filter-selector/service-filter-selector.component';
import { StationMapSelectorComponent } from './components/selection/station-map-selector/station-map-selector.component';
import { KeysPipe } from './pipes/object-keys-to-array.pipe';
import { ApiInterface } from './services/api-interface/api-interface.service';
import { LocalStorage } from './services/local-storage/local-storage.service';
import { MapCache } from './services/map/map.service';
import { Settings } from './services/settings/settings.service';
import { Time } from './services/time/time.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    ProviderSelectorComponent,
    DatasetByStationSelectorComponent,
    StationMapSelectorComponent,
    ServiceFilterSelectorComponent,
    ZoomControlComponent,
    LocateControlComponent,
    KeysPipe,
    LabelMapperComponent
  ],
  entryComponents: [ProviderSelectorComponent],
  exports: [
    ProviderSelectorComponent,
    DatasetByStationSelectorComponent,
    StationMapSelectorComponent,
    ServiceFilterSelectorComponent,
    ZoomControlComponent,
    LocateControlComponent,
    KeysPipe,
    LabelMapperComponent
  ],
  providers: [
    Settings,
    LocalStorage,
    ProviderSelectorService,
    ApiInterface,
    Time,
    MapCache,
    LocateService,
    LabelMapperService
  ]
})
export class ToolboxModule { }
