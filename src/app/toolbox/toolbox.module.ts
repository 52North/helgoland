import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';

import { D3TimeseriesGraphComponent } from './components/graph/d3-timeseries-graph/d3-timeseries-graph.component';
import { PlotlyProfileGraphComponent } from './components/graph/plotly-profile-graph/plotly-profile-graph.component';

const COMPONENTS = [
    PlotlyProfileGraphComponent,
    D3TimeseriesGraphComponent
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
    providers: []
})
export class ToolboxModule { }
