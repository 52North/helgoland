import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';

import { BoolTogglerComponent } from './components/control/bool-toggler/bool-toggler.component';
import { LocateControlComponent } from './components/control/map/locate/locate.component';
import { LocateService } from './components/control/map/locate/locate.service';
import { ZoomControlComponent } from './components/control/map/zoom/zoom.component';
import { StringTogglerComponent } from './components/control/string-toggler/string-toggler.component';
import { ProfileEntryComponent } from './components/datasetlist/profile-entry/profile-entry.component';
import { TimeseriesEntryComponent } from './components/datasetlist/timeseries-entry/timeseries-entry.component';
import { GeometryMapViewerComponent } from './components/display/geometry-map-viewer/geometry-map-viewer.component';
import { LabelMapperComponent } from './components/display/label-mapper/label-mapper.component';
import { LabelMapperService } from './components/display/label-mapper/label-mapper.service';
import { D3TimeseriesGraphComponent } from './components/graph/d3-timeseries-graph/d3-timeseries-graph.component';
import { PlotlyProfileGraphComponent } from './components/graph/plotly-profile-graph/plotly-profile-graph.component';
import {
    DatasetByStationSelectorComponent,
} from './components/selection/dataset-by-station-selector/dataset-by-station-selector.component';
import { ListSelectorComponent } from './components/selection/list-selector/list-selector.component';
import { ListSelectorService } from './components/selection/list-selector/list-selector.service';
import { PlatformMapSelectorComponent } from './components/selection/map-selector/platform-map-selector.component';
import { StationMapSelectorComponent } from './components/selection/map-selector/station-map-selector.component';
import {
    ProfileTrajectoryMapSelectorComponent,
} from './components/selection/map-selector/trajectory-map-selector.component';
import { MultiPhenomenonListComponent } from './components/selection/multi-phenomenon-list/multi-phenomenon-list.component';
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
import { TimeListSelectorComponent } from './components/selection/time-list-selector/time-list-selector.component';
import {
    TimeRangeSliderSelectorComponent,
} from './components/selection/time-range-slider-selector/time-range-slider-selector.component';
import {
    TimeseriesStyleSelectorComponent,
} from './components/selection/timeseries-style-selector/timeseries-style-selector.component';
import { TimespanSelectorComponent } from './components/selection/timespan-selector/timespan-selector.component';
import {
    TimespanShiftSelectorComponent,
} from './components/selection/timespan-shift-selector/timespan-shift-selector.component';

const COMPONENTS = [
    ProviderSelectorComponent,
    DatasetByStationSelectorComponent,
    StationMapSelectorComponent,
    PlatformMapSelectorComponent,
    ProfileTrajectoryMapSelectorComponent,
    ServiceFilterSelectorComponent,
    ZoomControlComponent,
    LocateControlComponent,
    LabelMapperComponent,
    ListSelectorComponent,
    MultiServiceFilterSelectorComponent,
    TimespanShiftSelectorComponent,
    PredefinedTimespanSelectorComponent,
    TimespanSelectorComponent,
    TimeseriesEntryComponent,
    ProfileEntryComponent,
    GeometryMapViewerComponent,
    StringTogglerComponent,
    BoolTogglerComponent,
    TimeseriesStyleSelectorComponent,
    TimeListSelectorComponent,
    TimeRangeSliderSelectorComponent,
    PlotlyProfileGraphComponent,
    D3TimeseriesGraphComponent,
    MultiPhenomenonListComponent
];

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ColorPickerModule,
        NgbAccordionModule,
        NgbDatepickerModule,
        NgbTimepickerModule
    ],
    declarations: [
        COMPONENTS
    ],
    entryComponents: [],
    exports: [
        COMPONENTS
    ],
    providers: [
        ProviderSelectorService,
        LocateService,
        LabelMapperService,
        ListSelectorService
    ]
})
export class ToolboxModule { }
