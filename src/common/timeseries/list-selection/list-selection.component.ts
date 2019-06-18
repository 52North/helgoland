import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  BlacklistedService,
  DatasetApi,
  IDataset,
  ParameterFilter,
  Provider,
  Service,
  Settings,
  SettingsService,
  ValueTypes,
} from '@helgoland/core';
import { ListSelectorParameter } from '@helgoland/selector';
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';

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
    type: 'category',
    header: 'Kategorie'
  }, {
    type: 'feature',
    header: 'Station'
  }, {
    type: 'phenomenon',
    header: 'Phänomen'
  }, {
    type: 'procedure',
    header: 'Sensor'
  }];

  public stationParams: Array<ListSelectorParameter> = [{
    type: 'feature',
    header: 'Station'
  }, {
    type: 'category',
    header: 'Kategorie'
  }, {
    type: 'phenomenon',
    header: 'Phänomen'
  }, {
    type: 'procedure',
    header: 'Sensor'
  }];

  public phenomenonParams: Array<ListSelectorParameter> = [{
    type: 'phenomenon',
    header: 'Phänomen'
  }, {
    type: 'category',
    header: 'Kategorie'
  }, {
    type: 'feature',
    header: 'Station'
  }, {
    type: 'procedure',
    header: 'Sensor'
  }];

  public procedureParams: Array<ListSelectorParameter> = [{
    type: 'procedure',
    header: 'Sensor'
  }, {
    type: 'feature',
    header: 'Station'
  }, {
    type: 'phenomenon',
    header: 'Phänomen'
  }, {
    type: 'category',
    header: 'Kategorie'
  }];

  @ViewChild('tabset')
  public tabset: NgbTabset;

  public datasetApis: Array<DatasetApi>;
  public providerBlacklist: Array<BlacklistedService>;
  public providerFilter: ParameterFilter;
  public selectedService: Service;
  public addedService: Service;

  public selectedProviderList: Array<Provider>;

  constructor(
    private timeseriesService: TimeseriesService,
    private settingsSrvc: SettingsService<Settings>,
    private cache: TimeseriesListSelectionCache,
    private cdr: ChangeDetectorRef,
    private router: TimeseriesRouter
  ) { }

  public ngOnInit() {
    this.datasetApis = this.settingsSrvc.getSettings().datasetApis;
    this.providerBlacklist = this.settingsSrvc.getSettings().providerBlackList;
    this.providerFilter = { valueTypes: ValueTypes.quantity };
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

  public serviceAdded(service: Service) {
    this.addedService = service;
  }

  public onDatasetSelected(datasetList: Array<IDataset>) {
    if (datasetList instanceof Array && datasetList.length === 1) {
      this.timeseriesService.addDataset(datasetList[0].internalId);
      this.router.navigateToDiagram();
    } else {
      console.error('datasetList is no array or has not the length of 1');
    }
  }
}
