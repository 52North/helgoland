import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';

import { BoolTogglerComponent } from './components/control/bool-toggler/bool-toggler.component';
import { LocateControlComponent } from './components/control/map/locate/locate.component';
import { LocateService } from './components/control/map/locate/locate.service';
import { ZoomControlComponent } from './components/control/map/zoom/zoom.component';
import { StringTogglerComponent } from './components/control/string-toggler/string-toggler.component';
import { DThreeDiagramComponent } from './components/display/d-three-diagram/d-three-diagram.component';
import {
    FlotOverviewTimeseriesDiagramComponent,
} from './components/display/flot-overview-timeseries-diagram/flot-overview-timeseries-diagram.component';
import {
    FlotTimeseriesDiagramComponent,
} from './components/display/flot-timeseries-diagram/flot-timeseries-diagram.component';
import { GeometryMapViewerComponent } from './components/display/geometry-map-viewer/geometry-map-viewer.component';
import { LabelMapperComponent } from './components/display/label-mapper/label-mapper.component';
import { LabelMapperService } from './components/display/label-mapper/label-mapper.service';
import { LegendEntryComponent } from './components/display/legend-entry/legend-entry.component';
import {
    DatasetByStationSelectorComponent,
} from './components/selection/dataset-by-station-selector/dataset-by-station-selector.component';
import { ListSelectorComponent } from './components/selection/list-selector/list-selector.component';
import { ListSelectorService } from './components/selection/list-selector/list-selector.service';
import {
    MultiServiceFilterSelectorComponent,
} from './components/selection/multi-service-filter-selector/multi-service-filter-selector.component';
import {
    PredefinedTimespanSelectorComponent,
} from './components/selection/predefined-timespan-selector/predefined-timespan-selector.component';
import { ProviderSelectorComponent } from './components/selection/provider-selector/provider-selector.component';
import { ProviderSelectorService } from './components/selection/provider-selector/provider-selector.service';
import {
    ServiceFilterSelectorComponent,
} from './components/selection/service-filter-selector/service-filter-selector.component';
import { StationMapSelectorComponent } from './components/selection/station-map-selector/station-map-selector.component';
import {
    TimeseriesStyleSelectorComponent,
} from './components/selection/timeseries-style-selector/timeseries-style-selector.component';
import { TimespanSelectorComponent } from './components/selection/timespan-selector/timespan-selector.component';
import {
    TimespanShiftSelectorComponent,
} from './components/selection/timespan-shift-selector/timespan-shift-selector.component';
import { PermalinkButtonComponent } from './permalink/permalink-button/permalink-button.component';
import { PermalinkInMailComponent } from './permalink/permalink-in-mail/permalink-in-mail.component';
import { PermalinkNewWindowComponent } from './permalink/permalink-new-window/permalink-new-window.component';
import { PermalinkToClipboardComponent } from './permalink/permalink-to-clipboard/permalink-to-clipboard.component';
import { KeysPipe } from './pipes/object-keys-to-array.pipe';
import { ApiInterface } from './services/api-interface/api-interface.service';
import { ApiMapping } from './services/api-interface/api-mapping.service';
import { CachingInterceptor, HttpCache } from './services/api-interface/caching/caching-interceptor';
import { LocalHttpCache } from './services/api-interface/caching/local-cache';
import { InternalIdHandler } from './services/api-interface/internal-id-handler.service';
import { LocalStorage } from './services/local-storage/local-storage.service';
import { MapCache } from './services/map/map.service';
import { PermalinkService } from './services/permalink/permalink.service';
import { Settings } from './services/settings/settings.service';
import { Time } from './services/time/time.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ColorPickerModule,
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
    MultiServiceFilterSelectorComponent,
    FlotOverviewTimeseriesDiagramComponent,
    TimespanShiftSelectorComponent,
    PredefinedTimespanSelectorComponent,
    TimespanSelectorComponent,
    LegendEntryComponent,
    GeometryMapViewerComponent,
    DThreeDiagramComponent,
    StringTogglerComponent,
    BoolTogglerComponent,
    PermalinkButtonComponent,
    PermalinkInMailComponent,
    PermalinkNewWindowComponent,
    PermalinkToClipboardComponent,
    FlotTimeseriesDiagramComponent,
    TimeseriesStyleSelectorComponent
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
    MultiServiceFilterSelectorComponent,
    FlotOverviewTimeseriesDiagramComponent,
    TimespanShiftSelectorComponent,
    PredefinedTimespanSelectorComponent,
    TimespanSelectorComponent,
    LegendEntryComponent,
    GeometryMapViewerComponent,
    DThreeDiagramComponent,
    StringTogglerComponent,
    BoolTogglerComponent,
    PermalinkButtonComponent,
    PermalinkInMailComponent,
    PermalinkNewWindowComponent,
    PermalinkToClipboardComponent,
    FlotTimeseriesDiagramComponent,
    TimeseriesStyleSelectorComponent
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
    ListSelectorService,
    PermalinkService,
    InternalIdHandler
  ]
})
export class ToolboxModule { }
