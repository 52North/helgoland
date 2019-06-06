import { Component, Input, SimpleChanges, OnChanges} from '@angular/core';
import { ServiceSelectorComponent, ServiceSelectorService } from '@helgoland/selector';
import { Service, DatasetApi } from '@helgoland/core';

import { CustomServiceProviderCache } from '../../timeseries/services/custom-service-provider-cache.service';

@Component({
  selector: 'n52-custom-service-selector',
  templateUrl: './custom-service-selector.component.html',
  styleUrls: ['./custom-service-selector.component.scss']
})
export class CustomServiceSelectorComponent extends ServiceSelectorComponent implements OnChanges{ 

  constructor(
    protected serviceSelectorService: ServiceSelectorService,
    protected customServiceProviderCache: CustomServiceProviderCache,
    )
    { 
      super(serviceSelectorService);
    }

  @Input() 
  public addedService: Service;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.addedService) {
      if(this.services && this.addedService){
        this.services.push(this.addedService);
      }
    }
  }

  public ngOnInit() {
    if (!this.filter) { this.filter = {}; }
    if (!this.providerBlacklist) { this.providerBlacklist = []; }
    if (this.datasetApiList) {
        this.loadingCount = this.datasetApiList.length;
        this.services = [];
        this.unResolvableServices = [];
        this.datasetApiList.forEach((api) => {
          this.handleApi(api);  
        });
        this.customServiceProviderCache.getDatasetApis().forEach((api) => {
          this.handleApi(api);
        }); 
    }
}

public isSelected(service: Service) {
    if (!this.selectedService) { return false; }
    return this.selectedService.id === service.id && this.selectedService.apiUrl === service.apiUrl;
}

public selectService(service: Service) {
    this.onServiceSelected.emit(service);
}

private handleApi(api: DatasetApi){
  this.serviceSelectorService.fetchServicesOfAPI(api.url, this.providerBlacklist, this.filter)
  .subscribe(
      (res) => {
          this.loadingCount--;
          if (res && res instanceof Array) {
              res.forEach((entry) => {
                  if (entry.quantities.platforms > 0
                      || this.supportStations && entry.quantities.stations > 0) {
                      this.services.push(entry);
                  }
              });
          }
          this.services.sort((a, b) => {
              if (a.label < b.label) { return -1; }
              if (a.label > b.label) { return 1; }
              return 0;
          });
      },
      (error) => {
          if (this.showUnresolvableServices) { this.unResolvableServices.push(api); }
          this.loadingCount--;
      });
}

}
