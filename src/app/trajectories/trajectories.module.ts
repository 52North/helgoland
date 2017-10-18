import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { HelgolandPermalinkModule, HelgolandToolboxModule } from 'helgoland-toolbox';

import { ToolboxModule } from './../toolbox/toolbox.module';
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
    ToolboxModule,
    HelgolandToolboxModule,
    HelgolandPermalinkModule,
    RouterModule.forRoot(
      trajectoriesRoutes,
      { enableTracing: false }
    ),
    NgbTabsetModule
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
