import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToolboxModule } from './../toolbox/toolbox.module';
import { ProfilesCombiViewComponent } from './combi-view/combi-view.component';
import { ProfilesDiagramComponent } from './diagram/diagram.component';
import { ProfilesNavigationComponent } from './navigation/navigation.component';
import { ProfilesSelectionPermalink } from './selection/selection-permalink.service';
import { ProfilesSelectionComponent } from './selection/selection.component';
import { ProfilesSelectionCache } from './selection/selection.service';

const profilesRoutes: Routes = [
  {
    path: 'profiles',
    component: ProfilesNavigationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'diagram'
      },
      {
        path: 'diagram',
        component: ProfilesDiagramComponent
      },
      {
        path: 'selection',
        component: ProfilesSelectionComponent
      },
      {
        path: 'combi',
        component: ProfilesCombiViewComponent
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
      profilesRoutes
    )
  ],
  declarations: [
    ProfilesDiagramComponent,
    ProfilesSelectionComponent,
    ProfilesCombiViewComponent,
    ProfilesNavigationComponent
  ],
  providers: [
    ProfilesSelectionCache,
    ProfilesSelectionPermalink
  ]
})
export class ProfilesModule { }
