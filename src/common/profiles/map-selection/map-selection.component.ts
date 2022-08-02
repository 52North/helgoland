import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ColorService,
  DatasetType,
  HelgolandParameterFilter,
  HelgolandPlatform,
  HelgolandProfile,
  HelgolandServicesConnector,
  PlatformTypes,
  Settings,
  SettingsService,
  TimedDatasetOptions,
  Timespan,
} from '@helgoland/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProfilesService } from '../services/profiles.service';

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

  public stationaryPlatform: HelgolandPlatform;
  public stationaryPlatformLoading: boolean;
  public platforms: HelgolandPlatform[];
  public stationaryPlatformDataset: HelgolandProfile;
  public stationaryTimestamps: Array<{ time: number}>;

  constructor(
    private settingsSrvc: SettingsService<Settings>,
    private modalService: NgbModal,
    private servicesConnector: HelgolandServicesConnector,
    private profilesSrvc: ProfilesService,
    private router: Router,
    private color: ColorService,
  ) {
    this.selectedProviderUrl = this.settingsSrvc.getSettings().datasetApis[0].url;
    this.stationFilter = {
      type: DatasetType.Profile,
      platformType: PlatformTypes.stationary,
      expanded: true
    };
    this.servicesConnector.getPlatforms(this.selectedProviderUrl, this.stationFilter).subscribe(res => this.platforms = res);
  }

  public onStationSelected(platform: HelgolandPlatform) {
    this.modalService.open(this.modalStationaryPlatform);
    this.stationaryPlatform = platform;
    this.stationaryPlatformLoading = true;
    platform.datasetIds.forEach(id => {
      this.servicesConnector.getDataset({ url: this.selectedProviderUrl, id }, { type: DatasetType.Profile }).subscribe(profile => {
        this.stationaryPlatformDataset = profile;
        const timespan = new Timespan(profile.firstValue.timestamp, profile.lastValue.timestamp);
        this.servicesConnector.getDatasetData(profile, timespan).subscribe(data => {
          this.stationaryTimestamps = [];
          data.values.forEach(entry => {
            this.stationaryTimestamps.push({
              time: entry.timestamp
            });
          });
          this.stationaryPlatformLoading = false;
        });
      });
    });
  }

  public profileSelected(timestamp: number) {
    return this.profilesSrvc.hasTimedDataset(this.stationaryPlatformDataset.internalId, timestamp);
  }

  public updateSelection(event: any, timestamp: number) {
    const options = new TimedDatasetOptions(this.stationaryPlatformDataset.internalId, this.color.getColor(), timestamp)
    if (event.target.checked) {
      this.profilesSrvc.addDataset(this.stationaryPlatformDataset.internalId, [options]);
    } else {
      this.profilesSrvc.removeDatasetOptions(options);
    }

  }

  public moveToChart() {
    this.router.navigate(['profiles/diagram']);
  }

}
