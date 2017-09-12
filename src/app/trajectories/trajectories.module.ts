import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToolboxModule } from './../toolbox/toolbox.module';
import { TrajectoriesNavigationComponent } from './navigation/navigation.component';
import { TrajectoriesSelectionComponent } from './selection/selection.component';
import { TrajectoriesConditionalRouter } from './services/trajectories-router.service';
import { TrajectoriesService } from './services/trajectories.service';
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
    NgbModule,
    RouterModule.forRoot(
      trajectoriesRoutes,
      { enableTracing: false }
    )
  ],
  declarations: [
    TrajectoriesViewComponent,
    TrajectoriesSelectionComponent,
    TrajectoriesNavigationComponent
  ],
  providers: [
    TrajectoriesService,
    TrajectoriesConditionalRouter
  ]
})
export class TrajectoriesModule { }
