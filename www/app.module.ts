import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';

import { TestComponent } from './src/test.component';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule
    ],
    declarations: [
        TestComponent
    ],
    entryComponents: [
        TestComponent
    ]
})

export class AppModule {
    ngDoBootstrap() {}
}
