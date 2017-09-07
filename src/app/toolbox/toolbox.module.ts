import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ProviderSelectorComponent } from './components/selection/provider-selector/provider-selector.component';
import { ProviderSelectorService } from './components/selection/provider-selector/provider-selector.service';
import { ApiInterface } from './services/api-interface/api-interface.service';
import { LocalStorage } from './services/local-storage/local-storage.service';
import { Settings } from './services/settings/settings.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [ProviderSelectorComponent],
  entryComponents: [ProviderSelectorComponent],
  exports: [ProviderSelectorComponent],
  providers: [Settings, LocalStorage, ProviderSelectorService, ApiInterface]
})
export class ToolboxModule { }
