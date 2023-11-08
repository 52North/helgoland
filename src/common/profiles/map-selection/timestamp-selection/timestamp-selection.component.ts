import { Component, Input, OnInit } from '@angular/core';
import { ColorService, HelgolandProfile, HelgolandServicesConnector, HelgolandDataFilter, TimedDatasetOptions, Timespan } from '@helgoland/core';

import { ProfilesService } from '../../services/profiles.service';

@Component({
  selector: 'app-timestamp-selection',
  templateUrl: './timestamp-selection.component.html',
  styleUrls: ['./timestamp-selection.component.scss']
})
export class TimestampSelectionComponent implements OnInit {

  @Input() dataset: HelgolandProfile;

  groupedTimestamps: Map<number, Array<{ time: number }>> = new Map();

  constructor(
    private servicesConnector: HelgolandServicesConnector,
    private profilesSrvc: ProfilesService,
    private color: ColorService,
  ) { }

  ngOnInit() {
    // Hook into helgoland-toolbox functionality to add select=timestamp parameter
    (this.servicesConnector as any).getConnector(this.dataset.url).subscribe((connector: any) => {
      if (connector.api.getDatasetDataRaw == undefined) {
        connector.api.getDatasetDataRaw = connector.api.getDatasetData;
        connector.api.getDatasetData = (id: string, apiUrl: string, params?: any) => {
          params["select"] = "timestamp"
          return connector.api.getDatasetDataRaw(id, apiUrl, params)
        }
      }
    });

    this.loadTimestamps();
  }

  ngOnDestroy() {
    // Remove Hook into helgoland-toolbox
    (this.servicesConnector as any).getConnector(this.dataset.url).subscribe((connector: any) => {
      if (connector.api.getDatasetDataRaw != undefined) {
        connector.api.getDatasetData = connector.api.getDatasetDataRaw;
        connector.api.getDatasetDataRaw = undefined;
      };
    });
  }

  profileSelected(timestamp: number) {
    return this.profilesSrvc.hasTimedDataset(this.dataset.internalId, timestamp);
  }

  updateSelection(event: any, timestamp: number) {
    const options = new TimedDatasetOptions(this.dataset.internalId, this.color.getColor(), timestamp)
    if (event.target.checked) {
      this.profilesSrvc.addDataset(this.dataset.internalId, [options]);
    } else {
      this.profilesSrvc.removeDatasetOptions(options);
    }
  }

  private loadTimestamps() {
    const timespan = new Timespan(this.dataset.firstValue.timestamp, this.dataset.lastValue.timestamp);
    this.servicesConnector.getDatasetData(this.dataset, timespan).subscribe(data => {
      data.values.forEach(val => {
        const date = new Date(val.timestamp);
        const year = date.getFullYear();
        const entry = { time: val.timestamp };
        if (this.groupedTimestamps.has(year)) {
          this.groupedTimestamps.get(year).push(entry)
        } else {
          this.groupedTimestamps.set(year, [entry])
        }
      });
    });
  }

}
