import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router/src/config';
import { HelgolandCachingModule } from '@helgoland/caching';
import { DatasetApiInterface, Settings, SettingsService, SplittedDataDatasetApiInterface } from '@helgoland/core';
import { JsonFavoriteExporterService } from '@helgoland/favorite';
import {
  NgbAccordionModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbTabsetModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ComponentsModule } from '../../../common/components/components.module';
import { InfoModule } from '../../../common/info/info.module';
import { ProfilesModule } from '../../../common/profiles/profiles.module';
import { TimeseriesRouter } from '../../../common/timeseries/services/timeseries-router.service';
import { nestedTimeseriesRoutes, TimeseriesModule } from '../../../common/timeseries/timeseries.module';
import { TrajectoriesModule } from '../../../common/trajectories/trajectories.module';
import { settings } from '../environments/environment';
import { AppComponent } from './app.component';
import { CustomTimeseriesRouter } from './router.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const baseRoutes: Routes = [
  ...nestedTimeseriesRoutes
];

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {

  constructor() {
    super();
    this.setSettings(settings);
  }

}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ComponentsModule,
    TimeseriesModule,
    TrajectoriesModule,
    ProfilesModule,
    InfoModule,
    HttpClientModule,
    HelgolandCachingModule,
    NgbTabsetModule,
    NgbAccordionModule,
    NgbModalModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    RouterModule.forRoot(
      baseRoutes
    )
  ],
  providers: [
    JsonFavoriteExporterService,
    {
      provide: SettingsService,
      useClass: ExtendedSettingsService
    },
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    },
    {
      provide: TimeseriesRouter,
      useClass: CustomTimeseriesRouter
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
