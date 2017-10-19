import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbAccordionModule, NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import {
    HelgolandFlotGraphModule,
    HelgolandPermalinkModule,
    HelgolandSelectorModule,
    HelgolandToolboxModule,
} from 'helgoland-toolbox';
import { HelgolandMapControlModule, HelgolandMapSelectorModule } from 'helgoland-toolbox/dist';

import { ToolboxModule } from './../toolbox/toolbox.module';
import { TimeseriesDiagramPermalink } from './diagram/diagram-permalink.service';
import { TimeseriesDiagramComponent } from './diagram/diagram.component';
import { TimeseriesListSelectionComponent } from './list-selection/list-selection.component';
import { TimeseriesMapSelectionComponent } from './map-selection/map-selection.component';
import { TimeseriesNavigationComponent } from './navigation/navigation.component';
import { TimeseriesProviderSelectionComponent } from './provider-selection/provider-selection.component';
import { TimeseriesProviderSelectionService } from './provider-selection/provider-selection.service';
import { TimeseriesConditionalRouter } from './services/timeseries-router.service';
import { TimeseriesService } from './services/timeseries.service';

const timeseriesRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'timeseries'
  },
  {
    path: 'timeseries',
    component: TimeseriesNavigationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'diagram'
      },
      {
        path: 'diagram',
        component: TimeseriesDiagramComponent
      },
      {
        path: 'map-selection',
        component: TimeseriesMapSelectionComponent
      },
      {
        path: 'list-selection',
        component: TimeseriesListSelectionComponent
      },
      {
        path: 'provider',
        component: TimeseriesProviderSelectionComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ToolboxModule,
    HelgolandToolboxModule,
    HelgolandPermalinkModule,
    HelgolandFlotGraphModule,
    HelgolandSelectorModule,
    HelgolandMapSelectorModule,
    HelgolandMapControlModule,
    RouterModule.forRoot(
      timeseriesRoutes
    ),
    NgbTabsetModule,
    NgbAccordionModule,
    NgbModalModule
  ],
  declarations: [
    TimeseriesNavigationComponent,
    TimeseriesDiagramComponent,
    TimeseriesListSelectionComponent,
    TimeseriesMapSelectionComponent,
    TimeseriesProviderSelectionComponent
  ],
  providers: [
    TimeseriesProviderSelectionService,
    TimeseriesService,
    TimeseriesConditionalRouter,
    TimeseriesDiagramPermalink
  ]
})
export class TimeseriesModule { }
