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
import { TimeseriesModule } from '../../../common/timeseries/timeseries.module';
import { settings } from '../environments/environment';
import { AppComponent } from './app.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const baseRoutes: Routes = [];

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
    InfoModule,
    HttpClientModule,
    HelgolandCachingModule,
    NgbTabsetModule.forRoot(),
    NgbAccordionModule.forRoot(),
    NgbModalModule.forRoot(),
    NgbDropdownModule.forRoot(),
    NgbDatepickerModule.forRoot(),
    NgbTimepickerModule.forRoot(),
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
