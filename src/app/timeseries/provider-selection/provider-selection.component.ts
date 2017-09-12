import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ParameterFilter } from './../../toolbox/model/api/parameterFilter';
import { Service } from './../../toolbox/model/api/service';
import { BlacklistedService } from './../../toolbox/model/config/config';
import { Settings } from './../../toolbox/services/settings/settings.service';
import { TimeseriesProviderSelectionService } from './provider-selection.service';

@Component({
  selector: 'app-provider-selection',
  templateUrl: './provider-selection.component.html',
  styleUrls: ['./provider-selection.component.scss']
})
export class TimeseriesProviderSelectionComponent implements OnInit {

  public providerList: Array<string>;
  public providerBlacklist: Array<BlacklistedService>;
  public providerFilter: ParameterFilter;
  public selectedProvider: Service;

  constructor(
    private settings: Settings,
    private providerCache: TimeseriesProviderSelectionService,
    private router: Router
  ) { }

  public ngOnInit() {
    this.selectedProvider = this.providerCache.getSelectedProvider();
    this.providerList = this.settings.config.restApiUrls;
    this.providerBlacklist = this.settings.config.providerBlackList;
    this.providerFilter = this.createFilter();
  }

  public onProviderSelected(provider: Service) {
    this.selectedProvider = provider;
    this.providerCache.setSelectedProvider(provider);
    this.router.navigate(['timeseries/map-selection']);
  }

  private createFilter(): ParameterFilter {
    return {
      valueTypes: 'quantity'
    };
  }

}
