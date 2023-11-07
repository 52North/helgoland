import { Component, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  ColorService,
  DatasetType,
  HelgolandParameterFilter,
  HelgolandPlatform,
  HelgolandProfile,
  HelgolandServicesConnector,
  Parameter,
  PlatformTypes,
  Settings,
  SettingsService,
  TimedDatasetOptions,
  Timespan,
} from "@helgoland/core";
import { MapCache } from "@helgoland/map";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { forkJoin } from "rxjs";

import { ProfilesService } from "../services/profiles.service";


@Component({
  selector: 'complete-map-selection',
  templateUrl: './map-selection.component.html',
  styleUrls: ['./map-selection.component.scss']
})
export class ProfilesMapSelectionComponent {

  @ViewChild('modalStationaryPlatform', { static: true })
  public modalStationaryPlatform: TemplateRef<any>;

  public selectedProviderUrl: string;
  public stationFilter: HelgolandParameterFilter;

  public selectedPlatform: HelgolandPlatform;
  public stationaryPlatformLoading: boolean;
  public platforms: HelgolandPlatform[];

  public selectedProfileDs: HelgolandProfile;
  public stationaryTimestamps: Array<{ time: number }>;
  public phenomenons: Parameter[];
  public selectedPhenomenon: Parameter;
  private profileDatasets: HelgolandProfile[];

  public legendToggled: boolean;
  public mapId = 'platform-map';

  public filterTerm: string;
  public filteredPlatforms: HelgolandPlatform[];
  public highlightPlatform: HelgolandPlatform;

  constructor(
    private settingsSrvc: SettingsService<Settings>,
    private modalService: NgbModal,
    private servicesConnector: HelgolandServicesConnector,
    private profilesSrvc: ProfilesService,
    private router: Router,
    private color: ColorService,
    private mapCache: MapCache
  ) {
    this.selectedProviderUrl = this.settingsSrvc.getSettings().datasetApis[0].url;
    this.stationFilter = {
      type: DatasetType.Profile,
      platformType: PlatformTypes.stationary,
      expanded: true
    };
    this.servicesConnector.getPlatforms(this.selectedProviderUrl, this.stationFilter).subscribe(res => {
      this.filteredPlatforms = res;
      this.platforms = res;
    });
  }

  public onStationSelected(platform: HelgolandPlatform) {
    this.modalService.open(this.modalStationaryPlatform);
    this.selectedPlatform = platform;
    this.selectedPhenomenon = undefined;
    this.stationaryPlatformLoading = true;
    this.profileDatasets = [];

    forkJoin(platform.datasetIds.map(id => this.servicesConnector.getDataset({ url: this.selectedProviderUrl, id }, { type: DatasetType.Profile })))
      .subscribe(datasets => {
        this.profileDatasets = datasets;
        this.phenomenons = datasets.map(ds => ds.parameters.phenomenon);
        this.stationaryPlatformLoading = false;
      })
  }

  selectPhenomenon(phenomenon: Parameter) {
    this.selectedPhenomenon = phenomenon;
    const profileDs = this.profileDatasets.find(e => e.parameters.phenomenon.id === phenomenon.id);
    if (profileDs) {
      this.setProfileDataset(profileDs);
    }
  }

  adjustFilter(ft: string) {
    this.filterTerm = ft;
    this.filteredPlatforms = this.platforms.filter(e => e.label.toLocaleLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) >= 0);
  }

  showOnPlatform(platform: HelgolandPlatform) {
    this.highlightPlatform = platform;
  }

  private setProfileDataset(profile: HelgolandProfile) {
    this.selectedProfileDs = profile;
    const timespan = new Timespan(profile.firstValue.timestamp, profile.lastValue.timestamp);
    this.servicesConnector.getDatasetData(profile, timespan).subscribe(data => {
      this.stationaryTimestamps = [];
      data.values.forEach(entry => {
        this.stationaryTimestamps.push({
          time: entry.timestamp
        });
      });
    });
  }

  public profileSelected(timestamp: number) {
    return this.profilesSrvc.hasTimedDataset(this.selectedProfileDs.internalId, timestamp);
  }

  public updateSelection(event: any, timestamp: number) {
    const options = new TimedDatasetOptions(this.selectedProfileDs.internalId, this.color.getColor(), timestamp)
    if (event.target.checked) {
      this.profilesSrvc.addDataset(this.selectedProfileDs.internalId, [options]);
    } else {
      this.profilesSrvc.removeDatasetOptions(options);
    }
  }

  public moveToChart() {
    this.router.navigate(['profiles/diagram']);
  }

}
