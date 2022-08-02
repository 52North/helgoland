import { Component } from '@angular/core';
import {
  ApiV3InterfaceService,
  HelgolandServicesConnector,
  InternalIdHandler,
  TimedDatasetOptions,
  Timespan,
} from '@helgoland/core';
import { ProfileEntryComponent } from '@helgoland/depiction';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'n52-custom-profile-entry',
  templateUrl: './custom-profile-entry.component.html',
  styleUrls: ['./custom-profile-entry.component.scss']
})
export class CustomProfileEntryComponent extends ProfileEntryComponent {

  constructor(
    protected servicesConnector: HelgolandServicesConnector,
    protected api: ApiV3InterfaceService,
    protected internalIdHandler: InternalIdHandler,
    protected translateSrvc: TranslateService
  ) {
    super(servicesConnector, internalIdHandler, translateSrvc)
  }

  toggleVisibility(options: TimedDatasetOptions) {
    options = JSON.parse(JSON.stringify(options));
    options.visible = !options.visible;
    const idx = this.datasetOptions.findIndex(e => e.timestamp === options.timestamp);
    this.datasetOptions[idx] = options;
    this.onUpdateOptions.emit(this.datasetOptions);
  }

  showGeometry(option: TimedDatasetOptions) {
    const resolve = this.internalIdHandler.resolveInternalId(option.internalId);
    this.api.getDataset(resolve.id, resolve.url).subscribe(res => this.onShowGeometry.emit(res.feature.geometry))
  }

  getTimeInterval(time: number) {
    return new Timespan(time, time);
  }
}
