import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HelgolandTimeseries, SettingsService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { CustomSettings } from '../../../../apps/timeseries/app/app.module';

@Component({
  selector: 'n52-station-description-link',
  templateUrl: './station-description-link.component.html',
  styleUrls: ['./station-description-link.component.scss']
})
export class StationDescriptionLinkComponent implements OnChanges {

  @Input() dataset: HelgolandTimeseries

  public url: string

  constructor(
    private settingsSrvc: SettingsService<CustomSettings>,
    public translateSrvc: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataset) {
      this.checkLink()
    }
  }

  checkLink() {
    if (this.dataset) {
      const featureDomainId = this.dataset.parameters.feature.domainId;
      const regex = new RegExp(this.settingsSrvc.getSettings().sensorDescription.regex);
      if (regex.test(featureDomainId)) {
        const id = featureDomainId.substring(0, featureDomainId.indexOf('_'));
        this.url = `${this.settingsSrvc.getSettings().sensorDescription.url}${id}.pdf`;
      }
    }
  }

  openLink() {
    window.open(this.url)
  }

}
