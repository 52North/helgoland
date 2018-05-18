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

import { ComponentsModule } from '../../../common/components/components.module';
import { TimeseriesDiagramPermalink } from '../../../common/timeseries/diagram/diagram-permalink.service';
import { TimeseriesDiagramComponent } from '../../../common/timeseries/diagram/diagram.component';
import { TimeseriesFavoritesComponent } from '../../../common/timeseries/favorites/favorites.component';
import { TimeseriesListSelectionComponent } from '../../../common/timeseries/list-selection/list-selection.component';
import { TimeseriesMapSelectionComponent } from '../../../common/timeseries/map-selection/map-selection.component';
import { TimeseriesNavigationComponent } from '../../../common/timeseries/navigation/navigation.component';
import { TimeseriesListSelectionCache } from '../../../common/timeseries/services/list-selection-cache.service';
import { TimeseriesMapSelectionCache } from '../../../common/timeseries/services/map-selection-cache.service';
import { TimeseriesRouter } from '../../../common/timeseries/services/timeseries-router.service';
import { TimeseriesService } from '../../../common/timeseries/services/timeseries.service';
import { TimeseriesTableComponent } from '../../../common/timeseries/table/table.component';
import { CustomTimeseriesRouter } from './router.service';

const timeseriesRoutes: Routes = [
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
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'diagram'
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
    {
      provide: TimeseriesRouter,
      useClass: CustomTimeseriesRouter
    },
    TimeseriesDiagramPermalink,
    TimeseriesListSelectionCache,
    TimeseriesMapSelectionCache
  ]
})
export class TimeseriesModule { }
