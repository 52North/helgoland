import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HelgolandDatasetTableModule } from '@helgoland/depiction/dataset-table';
import { HelgolandDatasetlistModule } from '@helgoland/depiction/datasetlist';
import { HelgolandFlotModule } from '@helgoland/flot';
import { HelgolandMapControlModule } from '@helgoland/map/control';
import { HelgolandMapSelectorModule } from '@helgoland/map/selector';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandTimeModule } from '@helgoland/time';
import { NgbAccordionModule, NgbDropdownModule, NgbModalModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from '../../app/components/components.module';
import { TimeseriesDiagramPermalink } from '../../app/timeseries/diagram/diagram-permalink.service';
import { TimeseriesDiagramComponent } from '../../app/timeseries/diagram/diagram.component';
import { TimeseriesFavoritesComponent } from '../../app/timeseries/favorites/favorites.component';
import {
  TimeseriesListSelectionCache,
  TimeseriesListSelectionComponent,
} from '../../app/timeseries/list-selection/list-selection.component';
import {
  TimeseriesMapSelectionCache,
  TimeseriesMapSelectionComponent,
} from '../../app/timeseries/map-selection/map-selection.component';
import { TimeseriesNavigationComponent } from '../../app/timeseries/navigation/navigation.component';
import { TimeseriesConditionalRouter } from '../../app/timeseries/services/timeseries-router.service';
import { TimeseriesService } from '../../app/timeseries/services/timeseries.service';
import { TimeseriesTableComponent } from '../../app/timeseries/table/table.component';

const timeseriesRoutes: Routes = [
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
    HelgolandTimeModule,
    HelgolandDatasetTableModule,
    HelgolandDatasetlistModule,
    HelgolandModificationModule,
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
