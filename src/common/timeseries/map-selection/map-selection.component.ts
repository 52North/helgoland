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
  DatasetApi,
  DatasetType,
  HelgolandParameterFilter,
  HelgolandPlatform,
  Phenomenon,
  PlatformTypes,
  Service,
  Settings,
  SettingsService,
  ValueTypes,
} from '@helgoland/core';
import { CachedMapComponent, MarkerSelectorGenerator, StationMapSelectorComponent } from '@helgoland/map';
import { NgbModal, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Layer } from 'leaflet';
import * as L from 'leaflet';

import { TimeseriesMapSelectionCache } from '../services/map-selection-cache.service';
import { TimeseriesRouter } from '../services/timeseries-router.service';
import { TimeseriesMapState, TimeseriesService } from './../services/timeseries.service';
import { CursorError } from '@angular/compiler/src/ml_parser/lexer';

class MarkerSelectorGeneratorImpl implements MarkerSelectorGenerator {

  public createDefaultGeometry?(platform: HelgolandPlatform): Layer {
    return L.geoJSON(platform.geometry, {
      onEachFeature: function (feature, layer) {
        layer.bindTooltip(platform.label);
      }
    });
  }
}

@Component({
  selector: 'n52-map-selection',
  templateUrl: './map-selection.component.html',
  styleUrls: ['./map-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimeseriesMapSelectionComponent implements OnInit, AfterViewInit {

  @ViewChild('modalStation', { static: true })
  public modalTemplate: TemplateRef<any>;

  @ViewChild('map')
  private map: StationMapSelectorComponent;

  // @ViewChild('tabset', { static: true })
  // public tabset: NgbTabset;

  public legendToggled: boolean;

  public datasetApis: Array<DatasetApi>;
  public providerBlacklist: Array<BlacklistedService>;
  public providerFilter: HelgolandParameterFilter;
  public selectedService: Service;
  public addedService: Service;

  public stationFilter: HelgolandParameterFilter;
  public phenomenonFilter: HelgolandParameterFilter;
  public selectedPhenomenonId: string;
  public currentBounds: Array<object>;
  public cluster = true;
  public station: HelgolandPlatform;
  public datasetSelections: Set<string> = new Set();
  public datasetRemoves: Set<string> = new Set();

  public markerSelectorGenerator: MarkerSelectorGenerator;

  private defaultPlatformTypes = PlatformTypes.stationary;
  private defaultValueTypes = ValueTypes.quantity;

  private showErrorMessage = false;
  public mapState: TimeseriesMapState;

  constructor(
    private timeseriesService: TimeseriesService,
    private modalService: NgbModal,
    private settingsSrvc: SettingsService<Settings>,
    private cache: TimeseriesMapSelectionCache,
    private cdr: ChangeDetectorRef,
    private router: TimeseriesRouter
  ) { }

  public ngOnInit() {
    this.markerSelectorGenerator = new MarkerSelectorGeneratorImpl();
    this.datasetApis = this.settingsSrvc.getSettings().datasetApis;
    this.providerBlacklist = this.settingsSrvc.getSettings().providerBlackList;
    this.providerFilter = { type: DatasetType.Timeseries };
    this.mapState = this.timeseriesService.getMapState();
    this.selectedPhenomenonId = this.mapState.selectedPhenomenonId;
  }

  public ngAfterViewInit(): void {
    console.log("ngAfterViewInit")
    if (this.cache.selectedService) {
      this.providerSelected(this.cache.selectedService);
      this.cdr.detectChanges();
    }
    if (this.mapState.selectedPhenomenonId && this.cache.selectedService) {
      this.updateStationFilter(this.mapState.selectedPhenomenonId);
    }

    // Zoom to the last known bounds. As the map always auto-resizes to the
    // bounds of the feature layer we cannot do more than just wait else
    // we are overwritten
    if (this.mapState.bounds) {
      setTimeout(() => {
        (this.map as any).map.fitBounds(this.mapState.bounds);
      }, 500)
    }

    // The map does not expose its bounds in any callback so we add a dirty
    // hook here
    (this.map as any).map.on('moveend', () => {
      const bounds = (this.map as any).map.getBounds();
      this.currentBounds = [
        new L.LatLng(bounds.getNorth(), bounds.getEast()),
        new L.LatLng(bounds.getSouth(), bounds.getWest())
      ];
    })
    // if (this.cache.lastTab) {
    //   this.tabset.select(this.cache.lastTab);
    //   this.cdr.detectChanges();
    // }
    // this.tabset.tabChange.subscribe((tabChange: NgbTabChangeEvent) => {
    //   this.cache.lastTab = tabChange.nextId;
    // });
  }

  ngOnDestroy() {
    // store mapState
    this.mapState.bounds = this.currentBounds;
    this.mapState.selectedPhenomenonId = this.selectedPhenomenonId;
    this.timeseriesService.saveMapState(this.mapState);
  }


  public providerSelected(service: Service) {
    this.selectedService = this.cache.selectedService = service;
    this.updateStationFilter();
    this.updatePhenomenonFilter();
    const id = 'selectByMap';
    // this.tabset.tabs.find(entry => entry.id === id).disabled = false;
    // this.tabset.select(id);
  }

  public serviceAdded(service: Service) {
    this.addedService = service;
  }

  public onStationSelected(station: HelgolandPlatform) {
    this.station = station;
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

  public onDatasetSelected(id: string) {
    this.datasetSelections.add(id);
    this.datasetRemoves.delete(id);
  }

  public onDatasetDeselected(id: string) {
    this.datasetRemoves.add(id);
    this.datasetSelections.delete(id);
  }

  public openDatasets() {
    this.datasetRemoves.forEach(e => this.timeseriesService.removeDataset(e));
    this.datasetSelections.forEach((entry) => this.timeseriesService.addDataset(entry));
    if (this.datasetSelections.size > 0) {
      this.router.navigateToDiagram();
    }
  }

  private updateStationFilter(phenomenonId?: string) {
    this.stationFilter = {
      type: DatasetType.Timeseries,
      service: this.selectedService.id
    };
    if (phenomenonId) { this.stationFilter.phenomenon = phenomenonId; }
  }

  private updatePhenomenonFilter() {
    this.phenomenonFilter = {
      type: DatasetType.Timeseries,
      service: this.selectedService.id
    };
  }
}
