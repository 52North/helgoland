import { Component, IterableDiffers, OnInit } from '@angular/core';

import { ProfilesService } from '../services/profiles.service';
import { Timespan, TimedDatasetOptions, DatasetPresenterComponent, HelgolandServicesConnector, InternalIdHandler, Time, TimezoneService, DatasetType, ProfileDataEntry, HelgolandProfile, HelgolandProfileData } from '@helgoland/core';
import { TimeseriesDiagramPermalink } from '../../timeseries/diagram/diagram-permalink.service';
import { TimeseriesRouter } from '../../timeseries/services/timeseries-router.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';


interface RawData {
  dataset: HelgolandProfile;
  datas: ProfileDataEntry[];
  options: TimedDatasetOptions[];
}

@Component({
  selector: 'n52-profile-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class ProfilesTableComponent extends DatasetPresenterComponent<TimedDatasetOptions[], RawData> implements OnInit {

  public datasetIds: Array<string>;
  public selectedIds: Array<string> = new Array();

  private rawData: Map<string, RawData> = new Map();
  private verticalMap: number[] = []
  private columnMap: Map<string, number[]> = new Map();
  private loading: boolean = true;
  private metadata: Map<string, { label: string, uom: string, color: string, timestamp: number }> = new Map();

  constructor(
    private profilesService: ProfilesService,
    public permalinkSrvc: TimeseriesDiagramPermalink,
    public router: TimeseriesRouter,
    protected iterableDiffers: IterableDiffers,
    protected servicesConnector: HelgolandServicesConnector,
    protected datasetIdResolver: InternalIdHandler,
    protected timeSrvc: Time,
    protected translateSrvc: TranslateService,
    protected timezoneSrvc: TimezoneService,
  ) {
    super(iterableDiffers, servicesConnector, datasetIdResolver, timeSrvc, translateSrvc, timezoneSrvc);
  }

  public ngOnInit() {
    this.permalinkSrvc.validatePeramlink();
    this.datasetIds = this.profilesService.datasetIds;
    this.datasetOptions = this.profilesService.datasetOptions;
    this.selectedIds = this.datasetIds;
    this.timespan = { from: 12, to: 15 }
  }

  public isSelected(internalId: string) {
    return this.selectedIds.find(e => e === internalId);
  }

  public selectProfile(selected: boolean, internalId: string) {
    if (selected) {
      this.selectedIds.push(internalId);
    } else {
      this.selectedIds.splice(this.selectedIds.findIndex(entry => entry === internalId), 1);
    }
  }

  protected addDataset(id: string, url: string): void {
    this.loading = true;
    this.servicesConnector.getDataset({ id, url }, { type: DatasetType.Profile }).subscribe(dataset => {
      const options = this.datasetOptions.get(dataset.internalId);
      options.forEach((option) => {
        if (option.timestamp) {
          const timespan = new Timespan(option.timestamp);
          this.servicesConnector.getDatasetData(dataset, timespan).subscribe(data => {
            if (data.values.length === 1) {
              if (this.rawData.has(dataset.internalId)) {
                this.rawData.get(dataset.internalId).datas.push(data.values[0]);
                this.rawData.get(dataset.internalId).options.push(option);
              } else {
                this.rawData.set(dataset.internalId, {
                  dataset,
                  datas: [data.values[0]],
                  options: [option]
                });
              }
            }
          },
            (err) => {
              console.log(err);
            },
            () => {
              this.prepareData(this.rawData.get(dataset.internalId));
              this.loading = false;
            });
        }
      });

    });
  }
  protected removeDataset(internalId: string): void {
    this.rawData.get(internalId).options.forEach(op => {
      this.columnMap.delete(internalId + op.timestamp)
    })
  }


  protected datasetOptionsChanged(internalId: string, options: TimedDatasetOptions[], firstChange: boolean): void {
    if (!firstChange) {
      let newOptions = [];
      let newDatas = [];
      let raw = this.rawData.get(internalId);

      for (let option of raw.options) {
        this.columnMap.delete(internalId + option.timestamp)
      }

      for (let option of options) {
        newOptions.push(option);

        // If options are removed we need to remove according datas
        // unfortunately we have no information which options was removed, so order does not match anymore
        for (let data of raw.datas) {
          if (data.timestamp == option.timestamp) {
            newDatas.push(data);
            break;
          }
        }
      }
      this.rawData.get(internalId).datas = newDatas;
      this.rawData.get(internalId).options = newOptions;
      console.log(raw);
      console.log(this.columnMap);
      this.prepareData(raw);
    }
  }
  protected onResize(): void {

  }

  private prepareData(dataset: RawData): void {
    const datas: ProfileDataEntry[] = dataset.datas;
    const options: TimedDatasetOptions[] = dataset.options;
    let optionsCursor = 0;
    this.loading = true;
    datas.forEach(pde => {
      let option = options[optionsCursor]
      optionsCursor++;
      if (!option.visible) {
        return
      }
      let row: number[] = []
      let verticalIndex = 0;
      pde.value.forEach(elem => {
        let value = elem;
        while (value.vertical > this.verticalMap[verticalIndex]) {
          // We need to increase verticalIndex to catch up with value.vertical
          verticalIndex++;
          row.push(undefined)
        }
        if (this.verticalMap.length <= verticalIndex || value.vertical < this.verticalMap[verticalIndex]) {
          // We need to extend vM 
          this.verticalMap.splice(verticalIndex, 0, value.vertical)
          // Iterate over all existing datasets and add undefined rows
          for (let v of this.columnMap.values()) {
            v.splice(verticalIndex, 0, undefined)
          }
          verticalIndex++;
          row.push(value.value)
        } else if (value.vertical == this.verticalMap[verticalIndex]) {
          // vM contains exactly our vertical key
          verticalIndex++;
          row.push(value.value)
        }
      })
      let key = dataset.dataset.internalId + option.timestamp
      this.columnMap.set(key, row)
      this.metadata.set(key, {
        "label": dataset.dataset.label,
        "uom": dataset.dataset.uom,
        "color": option.color,
        "timestamp": option.timestamp
      })
      console.log(dataset)
    })
    this.loading = false;
  }

  protected getIndexFromInternalId(internalId: string) {
    // helper method
    return this.datasetIds.indexOf(internalId);
  }

  protected setSelectedId(internalId: string) {
  }

  protected removeSelectedId(internalId: string) {
  }

  reloadDataForDatasets(datasets: string[]): void {
    throw new Error('Method not implemented.');
  }
  protected onLanguageChanged(langChangeEvent: LangChangeEvent): void {
    throw new Error('Method not implemented.');
  }
  protected onTimezoneChanged(timezone: string): void {
    throw new Error('Method not implemented.');
  }
  protected timeIntervalChanges(): void {
    throw new Error('Method not implemented.');
  }
  protected presenterOptionsChanged(options: any): void {
    throw new Error('Method not implemented.');
  }
}
