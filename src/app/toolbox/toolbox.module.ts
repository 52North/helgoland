import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HelgolandDepictionModule } from 'helgoland-toolbox';
import { ColorPickerModule } from 'ngx-color-picker';

import { ProfileEntryComponent } from './components/datasetlist/profile-entry/profile-entry.component';
import { TimeseriesEntryComponent } from './components/datasetlist/timeseries-entry/timeseries-entry.component';
import { GeometryMapViewerComponent } from './components/display/geometry-map-viewer/geometry-map-viewer.component';
import { D3TimeseriesGraphComponent } from './components/graph/d3-timeseries-graph/d3-timeseries-graph.component';
import { PlotlyProfileGraphComponent } from './components/graph/plotly-profile-graph/plotly-profile-graph.component';
import { MultiPhenomenonListComponent } from './components/selection/multi-phenomenon-list/multi-phenomenon-list.component';
import {
    TimeseriesStyleSelectorComponent,
} from './components/selection/timeseries-style-selector/timeseries-style-selector.component';

const COMPONENTS = [
    TimeseriesEntryComponent,
    ProfileEntryComponent,
    GeometryMapViewerComponent,
    TimeseriesStyleSelectorComponent,
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
        HelgolandDepictionModule,
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
    providers: []
})
export class ToolboxModule { }
