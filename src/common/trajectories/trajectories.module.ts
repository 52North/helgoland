import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelgolandControlModule } from '@helgoland/control';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
import { HelgolandMapViewModule } from '@helgoland/map';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from '../components/components.module';
import { TrajectoriesNavigationComponent } from './navigation/navigation.component';
import { TrajectoriesSelectionComponent } from './selection/selection.component';
import { TrajectoriesConditionalRouter } from './services/trajectories-router.service';
import { TrajectoriesService } from './services/trajectories.service';
import { TrajectoriesViewPermalink } from './view/view-permalink';
import { TrajectoriesViewComponent } from './view/view.component';

const trajectoriesRoutes: Routes = [
  {
    path: 'trajectories',
    component: TrajectoriesNavigationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'view'
      },
      {
        path: 'view',
        component: TrajectoriesViewComponent
      },
      {
        path: 'selection',
        component: TrajectoriesSelectionComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    HelgolandControlModule,
    HelgolandDatasetlistModule,
    HelgolandMapViewModule,
    HelgolandModificationModule,
    HelgolandD3Module,
    HelgolandSelectorModule,
    RouterModule.forChild(
      trajectoriesRoutes
    ),
    NgbTabsetModule,
    ComponentsModule
  ],
  declarations: [
    TrajectoriesViewComponent,
    TrajectoriesSelectionComponent,
    TrajectoriesNavigationComponent
  ],
  providers: [
    TrajectoriesService,
    TrajectoriesConditionalRouter,
    TrajectoriesViewPermalink
  ]
})
export class TrajectoriesModule { }
