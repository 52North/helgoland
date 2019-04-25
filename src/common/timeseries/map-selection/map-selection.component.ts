import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  BlacklistedService,
  Dataset,
  DatasetApi,
  ParameterFilter,
  Phenomenon,
  Platform,
  PlatformTypes,
  Service,
  Settings,
  SettingsService,
  ValueTypes,
} from '@helgoland/core';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

import { TimeseriesMapSelectionCache } from '../services/map-selection-cache.service';
import { TimeseriesRouter } from '../services/timeseries-router.service';
import { TimeseriesService } from './../services/timeseries.service';

@Component({
  selector: 'n52-map-selection',
  templateUrl: './map-selection.component.html',
  styleUrls: ['./map-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimeseriesMapSelectionComponent implements OnInit, AfterViewInit {

  @ViewChild('modalStation')
  public modalTemplate: TemplateRef<any>;

  @ViewChild('tabset')
  public tabset: NgbTabset;

  public datasetApis: Array<DatasetApi>;
  public providerBlacklist: Array<BlacklistedService>;
  public providerFilter: ParameterFilter;
  public selectedService: Service;
  public addedService: Service;

  public stationFilter: ParameterFilter;
  public phenomenonFilter: ParameterFilter;
  public selectedPhenomenonId: string;
  public cluster = true;
  public platform: Platform;
  public datasetSelections: Array<Dataset> = [];

  private defaultPlatformTypes = PlatformTypes.stationary;
  private defaultValueTypes = ValueTypes.quantity;

  private showErrorMessage= false;


  constructor(
    private timeseriesService: TimeseriesService,
    private modalService: NgbModal,
    private settingsSrvc: SettingsService<Settings>,
    private cache: TimeseriesMapSelectionCache,
    private cdr: ChangeDetectorRef,
    private router: TimeseriesRouter
  ) { }

  public ngOnInit() {
    this.datasetApis = this.settingsSrvc.getSettings().datasetApis;
    this.providerBlacklist = this.settingsSrvc.getSettings().providerBlackList;
    this.providerFilter = { valueTypes: ValueTypes.quantity };
    // this.
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
    this.updateStationFilter();
    this.updatePhenomenonFilter();
    const id = 'selectByMap';
    this.tabset.tabs.find(entry => entry.id === id).disabled = false;
    this.tabset.select(id);
  }

  public serviceAdded(service: Service) {
    this.addedService = service;
  }

  public onStationSelected(platform: Platform) {
    this.platform = platform;
    this.modalService.open(this.modalTemplate);
  }

  public onPhenomenonSelected(phenomenon: Phenomenon) {
    this.selectedPhenomenonId = phenomenon.id;
    this.updateStationFilter(phenomenon.id);
  }

  public onAllPhenomenonSelected() {
    this.selectedPhenomenonId = null;
    this.updateStationFilter();
  }

  public onDatasetSelectionChanged(datasets: Array<Dataset>) {
    this.datasetSelections = datasets;
  }

  public openDatasets() {
    if (this.datasetSelections.length > 0) {
      this.datasetSelections.forEach((entry) => {
        this.timeseriesService.addDataset(entry.internalId);
        this.router.navigateToDiagram();
      });
    }
  }

  private updateStationFilter(phenomenonId?: string) {
    this.stationFilter = {
      platformTypes: this.defaultPlatformTypes,
      valueTypes: this.defaultValueTypes,
      service: this.selectedService.id
    };
    if (phenomenonId) { this.stationFilter.phenomenon = phenomenonId; }
  }

  private updatePhenomenonFilter() {
    this.phenomenonFilter = {
      platformTypes: this.defaultPlatformTypes,
      valueTypes: this.defaultValueTypes,
      service: this.selectedService.id
    };
  }
}
