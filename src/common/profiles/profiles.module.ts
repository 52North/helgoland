import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HelgolandCoreModule } from '@helgoland/core';
import {
  HelgolandDatasetDownloadModule,
  HelgolandDatasetlistModule,
  HelgolandLabelMapperModule,
} from '@helgoland/depiction';
import { HelgolandMapSelectorModule, HelgolandMapViewModule } from '@helgoland/map';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandPlotlyModule } from '@helgoland/plotly';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandTimeModule } from '@helgoland/time';
import { HelgolandTimeRangeSliderModule } from '@helgoland/time-range-slider';
import { NgbAccordionModule, NgbButtonsModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from '../components/components.module';
import { ProfilesCombiViewPermalink } from './combi-view/combi-view-permalink.service';
import { ProfilesCombiViewComponent } from './combi-view/combi-view.component';
import { ProfilesCombiService } from './combi-view/combi-view.service';
import { ProfilesDiagramPermalink } from './diagram/diagram-permalink.service';
import { ProfilesDiagramComponent } from './diagram/diagram.component';
import { CustomProfileEntryComponent } from './diagram/profile-entry/custom-profile-entry.component';
import { ProfilesMapSelectionComponent } from './map-selection/map-selection.component';
import { ProfilesNavigationComponent } from './navigation/navigation.component';
import { ProfilesSelectionPermalink } from './selection/selection-permalink.service';
import { ProfilesSelectionComponent } from './selection/selection.component';
import { ProfilesSelectionCache } from './selection/selection.service';
import { ProfilesService } from './services/profiles.service';

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
        path: 'map-selection',
        component: ProfilesMapSelectionComponent
      },
      // {
      //   path: 'combi',
      //   component: ProfilesCombiViewComponent
      // }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    HelgolandCoreModule,
    HelgolandPlotlyModule,
    HelgolandMapViewModule,
    HelgolandDatasetlistModule,
    HelgolandDatasetDownloadModule,
    HelgolandModificationModule,
    HelgolandMapSelectorModule,
    HelgolandLabelMapperModule,
    HelgolandTimeModule,
    HelgolandTimeRangeSliderModule,
    HelgolandSelectorModule,
    RouterModule.forChild(
      profilesRoutes
    ),
    NgbTabsetModule,
    NgbAccordionModule,
    NgbButtonsModule,
    ComponentsModule
  ],
  declarations: [
    ProfilesDiagramComponent,
    ProfilesMapSelectionComponent,
    ProfilesSelectionComponent,
    ProfilesCombiViewComponent,
    ProfilesNavigationComponent,
    CustomProfileEntryComponent
  ],
  providers: [
    ProfilesDiagramPermalink,
    ProfilesSelectionCache,
    ProfilesSelectionPermalink,
    ProfilesService,
    ProfilesCombiService,
    ProfilesCombiViewPermalink
  ]
})
export class ProfilesModule { }
