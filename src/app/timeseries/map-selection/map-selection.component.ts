import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Dataset, PlatformTypes, ValueTypes } from './../../toolbox/model/api/dataset';
import { Phenomenon } from './../../toolbox/model/api/phenomenon';
import { Platform } from './../../toolbox/model/api/platform';
import { TimeseriesProviderSelectionService } from './../provider-selection/provider-selection.service';
import { TimeseriesService } from './../services/timeseries.service';

@Component({
  selector: 'app-map-selection',
  templateUrl: './map-selection.component.html',
  styleUrls: ['./map-selection.component.scss']
})
export class TimeseriesMapSelectionComponent implements OnInit {

  public providerUrl;
  public stationFilter;
  public phenomenonFilter;
  public selectedPhenomenonId;
  public cluster = true;
  public platform;
  public datasetSelections: Array<Dataset> = [];

  private defaultPlatformTypes = PlatformTypes[PlatformTypes.stationary];
  private defaultValueTypes = ValueTypes[ValueTypes.quantity];
  private provider = this.providerCache.getSelectedProvider();

  constructor(
    private providerCache: TimeseriesProviderSelectionService,
    private timeseriesService: TimeseriesService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  public ngOnInit() {
    this.providerUrl = this.provider.providerUrl;
    this.updateStationFilter();
    this.updatePhenomenonFilter();
  }

  public onStationSelected(platform: Platform, content: TemplateRef<any>) {
    this.platform = platform;
    this.modalService.open(content);
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
        this.timeseriesService.addTimeseries(entry, entry.url);
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
