import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HelgolandDatasetTableModule } from '@helgoland/depiction/dataset-table';
import { HelgolandDatasetlistModule } from '@helgoland/depiction/datasetlist';
import { HelgolandFlotModule } from '@helgoland/flot';
import { HelgolandMapControlModule } from '@helgoland/map/control';
import { HelgolandMapSelectorModule } from '@helgoland/map/selector';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { NgbAccordionModule, NgbDropdownModule, NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from '../components/components.module';
import { TimeseriesDiagramPermalink } from './diagram/diagram-permalink.service';
import { TimeseriesDiagramComponent } from './diagram/diagram.component';
import { TimeseriesFavoritesComponent } from './favorites/favorites.component';
import { TimeseriesListSelectionCache, TimeseriesListSelectionComponent } from './list-selection/list-selection.component';
import { TimeseriesMapSelectionCache, TimeseriesMapSelectionComponent } from './map-selection/map-selection.component';
import { TimeseriesNavigationComponent } from './navigation/navigation.component';
import { TimeseriesConditionalRouter } from './services/timeseries-router.service';
import { TimeseriesService } from './services/timeseries.service';
import { TimeseriesTableComponent } from './table/table.component';

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
        path: 'table',
        component: TimeseriesTableComponent
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
        path: 'favorites',
        component: TimeseriesFavoritesComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    HelgolandDatasetlistModule,
    HelgolandFlotModule,
    HelgolandDatasetTableModule,
    HelgolandSelectorModule,
    HelgolandMapSelectorModule,
    HelgolandMapControlModule,
    RouterModule.forChild(
      timeseriesRoutes
    ),
    NgbTabsetModule,
    NgbAccordionModule,
    NgbModalModule,
    NgbDropdownModule,
    ComponentsModule
  ],
  declarations: [
    TimeseriesNavigationComponent,
    TimeseriesDiagramComponent,
    TimeseriesTableComponent,
    TimeseriesListSelectionComponent,
    TimeseriesMapSelectionComponent,
    TimeseriesFavoritesComponent
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
