import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BasicAuthInformer, HelgolandBasicAuthModule } from '@helgoland/auth';
import { HelgolandCachingModule } from '@helgoland/caching';
import {
  DatasetApiInterface,
  DatasetApiV1ConnectorProvider,
  DatasetApiV2ConnectorProvider,
  DatasetApiV3ConnectorProvider,
  HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  Settings,
  SettingsService,
  SplittedDataDatasetApiInterface,
} from '@helgoland/core';
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

import { BasicAuthInformerImplService } from '../../../common/components/basic-auth/basic-auth-informer-impl.service';
import { ComponentsModule } from '../../../common/components/components.module';
import { InfoModule } from '../../../common/info/info.module';
import { TimeseriesModule, timeseriesRoutes } from '../../../common/timeseries/timeseries.module';
import { settings } from '../environments/environment';
import { AppComponent } from './app.component';
import { CustomStaApiV1ConnectorService } from './custom-sta-api-v1-connector.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const baseRoutes: Routes = [
  ...timeseriesRoutes,
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'diagram'
  }
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
    InfoModule,
    HttpClientModule,
    HelgolandCachingModule.forRoot({
      cachingDurationInMilliseconds: 300000,
      getDataCacheActive: false
    }),
    HelgolandBasicAuthModule,
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
      provide: BasicAuthInformer,
      useClass: BasicAuthInformerImplService
    },
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    },
    {
      provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
      useClass: CustomStaApiV1ConnectorService,
      multi: true
    },
    DatasetApiV1ConnectorProvider,
    DatasetApiV2ConnectorProvider,
    DatasetApiV3ConnectorProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
