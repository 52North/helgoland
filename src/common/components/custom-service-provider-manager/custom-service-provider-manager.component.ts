import { Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

import { BlacklistedService, DatasetApi, ParameterFilter, Service , Settings, SettingsService,} from '@helgoland/core';

import { ServiceSelectorService } from '@helgoland/selector';

@Component({
  selector: 'n52-custom-service-provider-manager',
  templateUrl: './custom-service-provider-manager.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CustomServiceProviderManagerComponent  {

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
  public onServiceAdded: EventEmitter<Service> = new EventEmitter<Service>();

  private showErrorMessage = false;
  private showSuccessMessage = false;
  private showWarningMessage = false;

  constructor(
    protected serviceSelectorService: ServiceSelectorService,
    private settingsSrvc: SettingsService<Settings>
  ) { }

  public addProvider(url: string){
    if (this.datasetApiList.find( element => element.url === url)){
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
                        || this.supportStations && entry.quantities.stations > 0) {
                        this.datasetApiList.push({
                          url: entry.apiUrl,
                          name: entry.label
                        });
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
