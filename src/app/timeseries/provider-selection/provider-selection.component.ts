import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Settings } from './../../toolbox/services/settings/settings.service';
import { TimeseriesProviderSelectionService } from './provider-selection.service';

@Component({
  selector: 'app-provider-selection',
  templateUrl: './provider-selection.component.html',
  styleUrls: ['./provider-selection.component.scss']
})
export class TimeseriesProviderSelectionComponent implements OnInit {

  public providerList;
  public providerBlacklist;
  public providerFilter;
  public selectedProvider;

  constructor(
    private settings: Settings,
    private providerCache: TimeseriesProviderSelectionService,
    private router: Router
  ) { }

  public ngOnInit() {
    this.selectedProvider = this.providerCache.getSelectedProvider();
    this.providerList = this.settings.config['restApiUrls'];
    this.providerBlacklist = this.settings.config['providerBlackList'];
    this.providerFilter = this.createFilter();
  }

  public onProviderSelected(provider) {
    this.selectedProvider = provider;
    this.providerCache.setSelectedProvider(provider);
    this.router.navigate(['timeseries/map-selection']);
  }

  private createFilter() {
    const filter = {
      valueTypes: 'quantity'
    };
    return filter;
  }

}
