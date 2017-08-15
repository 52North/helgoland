import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ServicesModule } from './src/services/services.module';
import { TimeseriesModule } from './src/components/view/timeseries';
import { ControlModule } from './src/components/control';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        HttpClientModule,
        ServicesModule,
        TimeseriesModule,
        ControlModule,
        NgbModule.forRoot()
    ],
    declarations: [],
    entryComponents: [],
    providers: []
})
export class AppModule {
    ngDoBootstrap() { }
}
