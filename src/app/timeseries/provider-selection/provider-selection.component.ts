import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlacklistedService, ParameterFilter, Service } from 'helgoland-toolbox';

import { Settings } from './../../services/settings.service';
import { TimeseriesProviderSelectionService } from './provider-selection.service';

@Component({
  selector: 'n52-provider-selection',
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
