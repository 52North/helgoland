import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PlatformTypes } from '../../toolbox/model/api/dataset/platformTypes';
import { ValueTypes } from '../../toolbox/model/api/dataset/valueTypes';
import { Dataset } from './../../toolbox/model/api/dataset/dataset';
import { ParameterFilter } from './../../toolbox/model/api/parameterFilter';
import { Phenomenon } from './../../toolbox/model/api/phenomenon';
import { Platform } from './../../toolbox/model/api/platform';
import { Service } from './../../toolbox/model/api/service';
import { TimeseriesProviderSelectionService } from './../provider-selection/provider-selection.service';
import { TimeseriesService } from './../services/timeseries.service';

@Component({
  selector: 'n52-map-selection',
  templateUrl: './map-selection.component.html',
  styleUrls: ['./map-selection.component.scss']
})
export class TimeseriesMapSelectionComponent implements OnInit {

  @ViewChild('modalStation')
  public modalTemplate: TemplateRef<any>;

  public provider: Service;
  public stationFilter: ParameterFilter;
  public phenomenonFilter: ParameterFilter;
  public selectedPhenomenonId: string;
  public cluster = true;
  public platform: Platform;
  public datasetSelections: Array<Dataset> = [];

  private defaultPlatformTypes = PlatformTypes.stationary;
  private defaultValueTypes = ValueTypes.quantity;

  constructor(
    private providerCache: TimeseriesProviderSelectionService,
    private timeseriesService: TimeseriesService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  public ngOnInit() {
    this.provider = this.providerCache.getSelectedProvider();
    if (this.provider) {
      this.updateStationFilter();
      this.updatePhenomenonFilter();
    }
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
        this.router.navigate(['timeseries/diagram']);
      });
    }
  }

  private updateStationFilter(phenomenonId?: string) {
    this.stationFilter = {
      platformTypes: this.defaultPlatformTypes,
      valueTypes: this.defaultValueTypes,
      service: this.provider.id
    };
    if (phenomenonId) { this.stationFilter.phenomenon = phenomenonId; }
  }

  private updatePhenomenonFilter() {
    this.phenomenonFilter = {
      platformTypes: this.defaultPlatformTypes,
      valueTypes: this.defaultValueTypes,
      service: this.provider.id
    };
  }

}
