import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { HelgolandTimeseries, SettingsService, StaReadInterfaceService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { CustomSettings } from '../../../../apps/timeseries/app/app.module';

@Component({
  selector: 'n52-min-max-value-component',
  templateUrl: './min-max-value-component.component.html',
  styleUrls: ['./min-max-value-component.component.scss']
})
export class MinMaxValueComponentComponent implements OnChanges {

  @Input() dataset: HelgolandTimeseries;

  @Input() maxValue = true;

  @Output() selectValue: EventEmitter<Date> = new EventEmitter();

  public value: string;
  public valueDate: Date;
  public loading: boolean;

  constructor(
    private sta: StaReadInterfaceService,
    private settingsSrvc: SettingsService<CustomSettings>,
    public translateSrvc: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataset) {
      this.fetchValue();
    }
  }

  fetchValue() {
    if (this.dataset) {
      this.loading = true;
      const apiConf = this.settingsSrvc.getSettings().datasetApis.find(e => e.url === this.dataset.url);
      if (apiConf && apiConf.connector) {
        if (apiConf.connector === "CustomStaApiV1ConnectorService") {
          this.fetchValueOfSta(this.dataset.url, this.dataset.id);
        } else {
          const mapping = this.settingsSrvc.getSettings().staApiMapping.find(e => e.api === this.dataset.url)
          if (mapping) {
            const url = mapping.sta;
            const domainId = this.dataset.parameters.feature.domainId;
            const filter = `ObservedProperty/name eq '${this.dataset.parameters.phenomenon.label}' and Observations/FeatureOfInterest/id eq '${domainId}'`;
            this.sta.getDatastreams(url, { $filter: filter }).subscribe(
              ds => {
                if (ds.value.length === 1) {
                  const id = ds.value[0]["@iot.id"];
                  this.fetchValueOfSta(url, id);
                } else {
                  this.loading = false;
                }
              },
              error => this.loading = false
            );
          } else {
            this.loading = false;
          }
        }
      } else {
        console.error(`Doesn't found connecter in the configuration for: ${this.dataset.url}`);
      }
    }
  }


  private fetchValueOfSta(url: string, id: string) {
    const orderDirection = this.maxValue ? 'desc' : 'asc';
    this.sta.getDatastreamObservationsRelation(
      url,
      id,
      { $orderby: `result ${orderDirection}`, $top: 1 }
    ).subscribe(
      res => {
        if (res.value.length === 1) {
          this.value = res.value[0].result;
          this.valueDate = new Date(res.value[0].resultTime);
        }
        this.loading = false;
      }, error => this.loading = false);
  }
}
