import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
    NgbAccordionModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgbTabsetModule,
    NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Settings } from 'helgoland-toolbox';

import { AppComponent } from './app.component';
import { ProfilesModule } from './profiles/profiles.module';
import { SettingsService } from './services/settings.service';
import { TimeseriesModule } from './timeseries/timeseries.module';
import { TrajectoriesModule } from './trajectories/trajectories.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    TimeseriesModule,
    TrajectoriesModule,
    ProfilesModule,
    NgbTabsetModule.forRoot(),
    NgbAccordionModule.forRoot(),
    NgbModalModule.forRoot(),
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot()
  ],
  providers: [
    {
      provide: Settings,
      useClass: SettingsService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
