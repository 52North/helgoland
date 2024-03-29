import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  BlacklistedService,
  DatasetApi,
  DatasetType,
  HelgolandDataset,
  HelgolandParameterFilter,
  Provider,
  Service,
  Settings,
  SettingsService,
} from '@helgoland/core';
import { ListSelectorParameter, MultiServiceFilterEndpoint } from '@helgoland/selector';
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { TimeseriesListSelectionCache } from '../services/list-selection-cache.service';
import { TimeseriesRouter } from '../services/timeseries-router.service';
import { TimeseriesService } from './../services/timeseries.service';

@Component({
  selector: 'n52-list-selection',
  templateUrl: './list-selection.component.html',
  styleUrls: ['./list-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimeseriesListSelectionComponent implements OnInit, AfterViewInit {

  public categoryParams: Array<ListSelectorParameter> = [{
    type: MultiServiceFilterEndpoint.category,
    header: this.translate.instant('list-selection.parameter.category')
  }, {
    type: MultiServiceFilterEndpoint.feature,
    header: this.translate.instant('list-selection.parameter.station')
  }, {
    type: MultiServiceFilterEndpoint.phenomenon,
    header: this.translate.instant('list-selection.parameter.phenomenon')
  }, {
    type: MultiServiceFilterEndpoint.procedure,
    header: this.translate.instant('list-selection.parameter.sensor')
  }];

  public stationParams: Array<ListSelectorParameter> = [{
    type: MultiServiceFilterEndpoint.feature,
    header: this.translate.instant('list-selection.parameter.station')
  }, {
    type: MultiServiceFilterEndpoint.category,
    header: this.translate.instant('list-selection.parameter.category')
  }, {
    type: MultiServiceFilterEndpoint.phenomenon,
    header: this.translate.instant('list-selection.parameter.phenomenon')
  }, {
    type: MultiServiceFilterEndpoint.procedure,
    header: this.translate.instant('list-selection.parameter.sensor')
  }];

  public phenomenonParams: Array<ListSelectorParameter> = [{
    type: MultiServiceFilterEndpoint.phenomenon,
    header: this.translate.instant('list-selection.parameter.phenomenon')
  }, {
    type: MultiServiceFilterEndpoint.category,
    header: this.translate.instant('list-selection.parameter.category')
  }, {
    type: MultiServiceFilterEndpoint.feature,
    header: this.translate.instant('list-selection.parameter.station')
  }, {
    type: MultiServiceFilterEndpoint.procedure,
    header: this.translate.instant('list-selection.parameter.sensor')
  }];

  public procedureParams: Array<ListSelectorParameter> = [{
    type: MultiServiceFilterEndpoint.procedure,
    header: this.translate.instant('list-selection.parameter.sensor')
  }, {
    type: MultiServiceFilterEndpoint.feature,
    header: this.translate.instant('list-selection.parameter.station')
  }, {
    type: MultiServiceFilterEndpoint.phenomenon,
    header: this.translate.instant('list-selection.parameter.phenomenon')
  }, {
    type: MultiServiceFilterEndpoint.category,
    header: this.translate.instant('list-selection.parameter.category')
  }];

  @ViewChild('tabset', { static: true })
  public tabset: NgbTabset;

  public datasetApis: Array<DatasetApi>;
  public providerBlacklist: Array<BlacklistedService>;
  public providerFilter: HelgolandParameterFilter;
  public parameterFilter: HelgolandParameterFilter = { type: DatasetType.Timeseries };
  public selectedService: Service;

  public selectedProviderList: Array<Provider>;

  constructor(
    private timeseriesService: TimeseriesService,
    private translate: TranslateService,
    private settingsSrvc: SettingsService<Settings>,
    private cache: TimeseriesListSelectionCache,
    private cdr: ChangeDetectorRef,
    private router: TimeseriesRouter
  ) { }

  public ngOnInit() {
    this.datasetApis = this.settingsSrvc.getSettings().datasetApis;
    this.providerBlacklist = this.settingsSrvc.getSettings().providerBlackList;
    this.providerFilter = { type: DatasetType.Timeseries };
  }

  public ngAfterViewInit(): void {
    if (this.cache.selectedService) {
      this.providerSelected(this.cache.selectedService);
      this.cdr.detectChanges();
    }
    if (this.cache.lastTab) {
      this.tabset.select(this.cache.lastTab);
      this.cdr.detectChanges();
    }
    this.tabset.tabChange.subscribe((tabChange: NgbTabChangeEvent) => {
      this.cache.lastTab = tabChange.nextId;
    });
  }

  public providerSelected(service: Service) {
    this.selectedService = this.cache.selectedService = service;
    this.selectedProviderList = [{
      id: service.id,
      url: service.apiUrl
    }];
    const id = 'selectByCategory';
    this.tabset.tabs.find(entry => entry.id === id).disabled = false;
    this.tabset.select(id);
  }

  public onDatasetSelected(datasetList: Array<HelgolandDataset>) {
    datasetList.forEach(e => this.timeseriesService.addDataset(e.internalId));
    this.router.navigateToDiagram();
  }
}
