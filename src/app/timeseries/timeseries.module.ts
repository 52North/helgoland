import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbAccordionModule, NgbDropdownModule, NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
    HelgolandDatasetlistModule,
    HelgolandFlotGraphModule,
    HelgolandMapControlModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
    HelgolandModificationModule,
    HelgolandPermalinkModule,
    HelgolandSelectorModule,
    HelgolandTimeModule,
} from 'helgoland-toolbox';

import { TimeseriesDiagramPermalink } from './diagram/diagram-permalink.service';
import { TimeseriesDiagramComponent } from './diagram/diagram.component';
import { TimeseriesListSelectionCache, TimeseriesListSelectionComponent } from './list-selection/list-selection.component';
import { TimeseriesMapSelectionCache, TimeseriesMapSelectionComponent } from './map-selection/map-selection.component';
import { TimeseriesNavigationComponent } from './navigation/navigation.component';
import { TimeseriesConditionalRouter } from './services/timeseries-router.service';
import { TimeseriesService } from './services/timeseries.service';

const timeseriesRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/timeseries'
  },
  {
    path: 'timeseries',
    component: TimeseriesNavigationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/diagram'
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
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/timeseries'
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    HelgolandPermalinkModule,
    HelgolandFlotGraphModule,
    HelgolandSelectorModule,
    HelgolandMapSelectorModule,
    HelgolandMapControlModule,
    HelgolandMapViewModule,
    HelgolandTimeModule,
    HelgolandDatasetlistModule,
    HelgolandModificationModule,
    RouterModule.forRoot(
      timeseriesRoutes
    ),
    NgbTabsetModule,
    NgbAccordionModule,
    NgbModalModule,
    NgbDropdownModule
  ],
  declarations: [
    TimeseriesNavigationComponent,
    TimeseriesDiagramComponent,
    TimeseriesListSelectionComponent,
    TimeseriesMapSelectionComponent
  ],
  providers: [
    TimeseriesService,
    TimeseriesConditionalRouter,
    TimeseriesDiagramPermalink,
    TimeseriesListSelectionCache,
    TimeseriesMapSelectionCache
  ]
})
export class TimeseriesModule { }
