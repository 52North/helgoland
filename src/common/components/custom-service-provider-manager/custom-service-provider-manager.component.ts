import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import {
  BlacklistedService,
  DatasetApi,
  HelgolandService,
  ParameterFilter,
  Service,
  Settings,
  SettingsService,
} from '@helgoland/core';
import { ServiceSelectorService } from '@helgoland/selector';

import { CustomServiceProviderCache } from '../../timeseries/services/custom-service-provider-cache.service';

@Component({
  selector: 'n52-custom-service-provider-manager',
  templateUrl: './custom-service-provider-manager.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CustomServiceProviderManagerComponent {

  @Input()
  public datasetApiList: Array<DatasetApi>;

  @Input()
  public providerBlacklist: BlacklistedService[];

  @Input()
  public filter: ParameterFilter;

  @Input()
  public supportStations: boolean;

  @Input()
  public services: Service[];

  @Output()
  public onServiceAdded: EventEmitter<HelgolandService> = new EventEmitter();

  public showErrorMessage = false;
  public showSuccessMessage = false;
  public showWarningMessage = false;
  public providerUrl: string;

  constructor(
    protected serviceSelectorService: ServiceSelectorService,
    private settingsSrvc: SettingsService<Settings>,
    private customServiceProviderCache: CustomServiceProviderCache
  ) { }

  public addProvider(url: string) {
    if (this.datasetApiList.find(element => element.url === url)
      || this.customServiceProviderCache.getDatasetApis().find(element => element.url === url)) {
      this.showWarningMessage = true;
      setTimeout(() => this.showWarningMessage = false, 5000);
      return;
    }
    this.serviceSelectorService.fetchServicesOfAPI(url, this.providerBlacklist, this.filter)
      .subscribe(
        (res) => {
          if (res && res instanceof Array) {
            res.forEach((entry) => {
              if (entry.quantities.platforms > 0
                || this.supportStations && entry.quantities.platforms > 0) {
                const datasetApi: DatasetApi = {
                  url: entry.apiUrl,
                  name: entry.label
                };
                this.datasetApiList.push(datasetApi);
                this.customServiceProviderCache.addDatasetApi(datasetApi);
                this.onServiceAdded.emit(entry);
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 5000);
              }
            });
          }
        },
        (error) => {
          this.showErrorMessage = true;
          setTimeout(() => this.showErrorMessage = false, 5000);
        });
  }

}
