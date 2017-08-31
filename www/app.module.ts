import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ControlModule } from './src/components/control';
import { TimeseriesModule } from './src/components/view/timeseries';
import { TrajectoryModule } from './src/components/view/trajectory/trajectory.module';
import { ServicesModule } from './src/services/services.module';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        HttpClientModule,
        ServicesModule,
        TimeseriesModule,
        TrajectoryModule,
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
