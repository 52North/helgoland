import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LocateControlComponent } from './components/control/map/locate/locate.component';
import { LocateService } from './components/control/map/locate/locate.service';
import { ZoomControlComponent } from './components/control/map/zoom/zoom.component';
import { LabelMapperComponent } from './components/display/label-mapper/label-mapper.component';
import { LabelMapperService } from './components/display/label-mapper/label-mapper.service';
import {
  DatasetByStationSelectorComponent,
} from './components/selection/dataset-by-station-selector/dataset-by-station-selector.component';
import { ListSelectorComponent } from './components/selection/list-selector/list-selector.component';
import { ListSelectorService } from './components/selection/list-selector/list-selector.service';
import {
  MultiServiceFilterSelectorComponent,
} from './components/selection/multi-service-filter-selector/multi-service-filter-selector.component';
import { ProviderSelectorComponent } from './components/selection/provider-selector/provider-selector.component';
import { ProviderSelectorService } from './components/selection/provider-selector/provider-selector.service';
import {
  ServiceFilterSelectorComponent,
} from './components/selection/service-filter-selector/service-filter-selector.component';
import { StationMapSelectorComponent } from './components/selection/station-map-selector/station-map-selector.component';
import { KeysPipe } from './pipes/object-keys-to-array.pipe';
import { ApiInterface } from './services/api-interface/api-interface.service';
import { ApiMapping } from './services/api-interface/api-mapping.service';
import { CachingInterceptor, HttpCache } from './services/api-interface/caching/caching-interceptor';
import { LocalHttpCache } from './services/api-interface/caching/local-cache';
import { LocalStorage } from './services/local-storage/local-storage.service';
import { MapCache } from './services/map/map.service';
import { Settings } from './services/settings/settings.service';
import { Time } from './services/time/time.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule.forRoot()
  ],
  declarations: [
    ProviderSelectorComponent,
    DatasetByStationSelectorComponent,
    StationMapSelectorComponent,
    ServiceFilterSelectorComponent,
    ZoomControlComponent,
    LocateControlComponent,
    KeysPipe,
    LabelMapperComponent,
    ListSelectorComponent,
    MultiServiceFilterSelectorComponent
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
    LabelMapperComponent,
    ListSelectorComponent,
    MultiServiceFilterSelectorComponent
  ],
  providers: [
    {
      provide: HttpCache,
      useClass: LocalHttpCache
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptor,
      multi: true
    },
    Settings,
    LocalStorage,
    ProviderSelectorService,
    ApiInterface,
    ApiMapping,
    Time,
    MapCache,
    LocateService,
    LabelMapperService,
    ListSelectorService
  ]
})
export class ToolboxModule { }
