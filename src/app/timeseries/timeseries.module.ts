import { TimeseriesProviderSelectionComponent } from './provider-selection/provider-selection.component';
import { TimeseriesListSelectionComponent } from './list-selection/list-selection.component';
import { TimeseriesMapSelectionComponent } from './map-selection/map-selection.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimeseriesDiagramComponent } from './diagram/diagram.component';
import { TimeseriesNavigationComponent } from './navigation/navigation.component';

const timeseriesRoutes: Routes = [
  {
    path: 'timeseries',
    component: TimeseriesNavigationComponent,
    children: [
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
    RouterModule.forRoot(
      timeseriesRoutes,
      { enableTracing: true }
    )
  ],
  declarations: [
    TimeseriesNavigationComponent,
    TimeseriesDiagramComponent,
    TimeseriesListSelectionComponent,
    TimeseriesMapSelectionComponent,
    TimeseriesProviderSelectionComponent
  ]
})
export class TimeseriesModule { }
