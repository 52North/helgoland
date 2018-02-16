import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router/src/config';
import { CachingInterceptor, HttpCache, LocalHttpCache, LocalOngoingHttpCache, OnGoingHttpCache } from '@helgoland/caching';
import { ApiInterface, GetDataApiInterface, SettingsService } from '@helgoland/core';
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

import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ExtendedSettingsService } from './services/settings.service';
import { TimeseriesModule } from './timeseries/timeseries.module';
import { TrajectoriesModule } from './trajectories/trajectories.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const baseRoutes: Routes = [
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'timeseries'
  }
];

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
    HttpClientModule,
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
      provide: HttpCache,
      useClass: LocalHttpCache
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptor,
      multi: true
    },
    {
      provide: ApiInterface,
      useClass: GetDataApiInterface
    },
    {
      provide: OnGoingHttpCache,
      useClass: LocalOngoingHttpCache
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
