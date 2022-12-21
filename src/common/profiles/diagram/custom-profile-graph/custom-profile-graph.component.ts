import { AfterViewInit, Component, EventEmitter, IterableDiffers, Output } from '@angular/core';
import {
  DatasetPresenterComponent,
  DatasetType,
  HelgolandProfile,
  HelgolandServicesConnector,
  InternalIdHandler,
  PresenterHighlight,
  ProfileDataEntry,
  Time,
  TimedDatasetOptions,
  Timespan,
  TimezoneService,
} from '@helgoland/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { PlotlyService } from 'angular-plotly.js';
import * as d3 from 'd3';

interface RawData {
  dataset: HelgolandProfile;
  datas: ProfileDataEntry[];
  options: TimedDatasetOptions[];
}

const LINE_WIDTH_SELECTED = 5;
const LINE_WIDTH = 2;
const MARKER_SIZE_SELECTED = 10;
const MARKER_SIZE = 6;

@Component({
  selector: 'app-custom-profile-graph',
  templateUrl: './custom-profile-graph.component.html',
  styleUrls: ['./custom-profile-graph.component.scss']
})
export class CustomProfileGraphComponent extends DatasetPresenterComponent<TimedDatasetOptions[], any> implements AfterViewInit {

  @Output()
  public onHighlight: EventEmitter<PresenterHighlight> = new EventEmitter();

  public preparedData: any[] = [];
  private rawData: Map<string, RawData> = new Map();
  private counterXAxis = 0;
  private counterYAxis = 0;

  public layout: any = {
    autosize: true,
    showlegend: false,
    dragmode: 'pan',
    margin: {
      l: 40,
      r: 10,
      b: 40,
      t: 10
      // pad: 100
    },
    hovermode: 'closest'
  };

  public config: Partial<any> = {
    displayModeBar: false,
    modeBarButtonsToRemove: [
      'sendDataToCloud',
      'hoverCompareCartesian'
    ],
    displaylogo: false,
    showTips: false,
    scrollZoom: true
  };

  constructor(
    protected iterableDiffers: IterableDiffers,
    protected servicesConnector: HelgolandServicesConnector,
    protected datasetIdResolver: InternalIdHandler,
    protected timeSrvc: Time,
    protected translateSrvc: TranslateService,
    protected timezoneSrvc: TimezoneService,
    protected plotlyService: PlotlyService
  ) {
    super(iterableDiffers, servicesConnector, datasetIdResolver, timeSrvc, translateSrvc, timezoneSrvc);
  }

  public ngAfterViewInit(): void {
    this.processData();
  }

  protected onLanguageChanged(langChangeEvent: LangChangeEvent): void { }

  protected onTimezoneChanged(timezone: string): void { }

  public reloadDataForDatasets(datasetIds: string[]): void {
    console.log('reload data at ' + new Date());
  }

  // tslint:disable-next-line:no-empty
  protected timeIntervalChanges(): void { }

  protected addDataset(id: string, url: string): void {
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
            this.processData();
          });
        }
      });
    });
  }

  protected removeDataset(internalId: string): void {
    this.rawData.delete(internalId);
    this.processData();
  }

  protected setSelectedId(internalId: string): void {
    this.processData();
  }

  protected removeSelectedId(internalId: string): void {
    this.processData();
  }

  // tslint:disable-next-line:no-empty
  protected presenterOptionsChanged(options: any): void { }

  protected datasetOptionsChanged(internalId: string, options: TimedDatasetOptions[], firstChange: boolean): void {
    if (!firstChange) {
      // remove unused options
      // const removedIdx = this.rawData.get(internalId).options.findIndex((option) => {
      //     const idx = options.findIndex((e) => e.timestamp === option.timestamp);
      //     if (idx === -1) {
      //         return true;
      //     }
      // });
      // if (removedIdx > -1) {
      //     this.rawData.get(internalId).options.splice(removedIdx, 1);
      //     this.rawData.get(internalId).datas.splice(removedIdx, 1);
      // }
      this.rawData.get(internalId).options = options;
      this.processData();
    }
  }

  protected onResize(): void { }

  private processData() {
    this.clearLayout();
    this.clearData();
    this.rawData.forEach((dataEntry) => {
      dataEntry.options.forEach((option, key) => {
        if (option.visible) {
          const x = new Array<number>();
          const y = new Array<number>();
          const selected = this.selectedDatasetIds.indexOf(dataEntry.dataset.internalId) >= 0;
          dataEntry.datas[key].value.forEach((entry) => {
            x.push(entry.value);
            y.push(entry.vertical);
          });
          const prepared: any = {
            x,
            y,
            type: 'scatter',
            name: '',
            timestamp: option.timestamp,
            id: dataEntry.dataset.internalId,
            yaxis: this.createYAxis(dataEntry.dataset, dataEntry.datas[key]),
            xaxis: this.createXAxis(dataEntry.dataset, dataEntry.datas[key]),
            hovertemplate:
              `${dataEntry.dataset.parameters.feature.label}<br>` +
              `${dataEntry.dataset.parameters.phenomenon.label}<br>` +
              `in %{y}m %{x} ${dataEntry.dataset.uom}<br>`,
            hoverlabel: {
              bgcolor: "#FFF",
              bordercolor: option.color,
              font: {
                color: 'black'
              }
            },
            line: {
              color: option.color,
              width: selected ? LINE_WIDTH_SELECTED : LINE_WIDTH
            },
            marker: {
              size: selected ? MARKER_SIZE_SELECTED : MARKER_SIZE
            }
          };
          this.preparedData.push(prepared);
        }
      });
    });

    this.updateAxis();
  }

  private createXAxis(dataset: HelgolandProfile, data: ProfileDataEntry): string {
    let axis;
    for (const key in this.layout) {
      if (this.layout.hasOwnProperty(key) && key.startsWith('xaxis') && this.layout[key].title === dataset.uom) {
        axis = this.layout[key];
      }
    }
    const range = d3.extent(data.value, (d) => d.value);
    if (!axis) {
      this.counterXAxis = this.counterXAxis + 1;
      axis = this.layout['xaxis' + this.counterXAxis] = {
        id: 'x' + (this.counterXAxis > 1 ? this.counterXAxis : ''),
        anchor: 'free',
        title: dataset.uom,
        zeroline: true,
        hoverformat: '.2f',
        showline: false,
        range: [range[0], range[1]],
        overlaying: '',
        // rangemode: 'tozero',
        fixedrange: false
      };
      if (this.counterXAxis !== 1) {
        axis.overlaying = 'x';
      }
    } else {
      axis.range = d3.extent([range[0], range[1], axis.range[0], axis.range[1]]);
    }
    return axis.id;
  }

  private createYAxis(dataset: HelgolandProfile, data: ProfileDataEntry): string {
    let axis;
    // find axis
    for (const key in this.layout) {
      if (this.layout.hasOwnProperty(key) &&
        key.startsWith('yaxis') &&
        this.layout[key].title === data.verticalUnit) {
        axis = this.layout[key];
      }
    }
    if (!axis) {
      // add axis
      this.counterYAxis = this.counterYAxis + 1;
      axis = this.layout[('yaxis' + this.counterYAxis)] = {
        id: 'y' + (this.counterYAxis > 1 ? this.counterYAxis : ''),
        // zeroline: true,
        anchor: 'free',
        hoverformat: '.2r',
        side: 'left',
        autorange: 'reversed',
        showline: false,
        overlaying: '',
        title: data.verticalUnit,
        fixedrange: false
      };
      if (this.counterYAxis !== 1) {
        axis.overlaying = 'y';
      }
    }
    return axis.id;
  }

  private updateAxis() {
    if (this.counterYAxis > 1) {
      for (const key in this.layout) {
        if (this.layout.hasOwnProperty(key) && key.startsWith('xaxis')) {
          this.layout[key].domain = [(0.1 * this.counterYAxis) - 0.1, 1];
        }
      }
      let yaxisCount = 0;
      for (const key in this.layout) {
        if (this.layout.hasOwnProperty(key) && key.startsWith('yaxis')) {
          this.layout[key].position = 0.1 * yaxisCount;
          yaxisCount += 1;
        }
      }
    }
    if (this.counterXAxis > 1) {
      for (const key in this.layout) {
        if (this.layout.hasOwnProperty(key) && key.startsWith('yaxis')) {
          this.layout[key].domain = [(0.06 * this.counterXAxis) - 0.06, 1];
        }
      }
      let xaxisCount = 0;
      for (const key in this.layout) {
        if (this.layout.hasOwnProperty(key) && key.startsWith('xaxis')) {
          this.layout[key].position = 0.06 * xaxisCount;
          xaxisCount += 1;
        }
      }
    }
    // add offset to xaxis ranges
    for (const key in this.layout) {
      if (this.layout.hasOwnProperty(key) && key.startsWith('xaxis')) {
        const range = this.layout[key].range;
        const rangeOffset = (range[1] - range[0]) * 0.05;
        this.layout[key].range = [range[0] - rangeOffset, range[1] + rangeOffset];
      }
    }
  }

  // private drawChart() {
  //     this.processData();
  // }

  private clearLayout() {
    // todo remove yaxis
    for (const key in this.layout) {
      if (this.layout.hasOwnProperty(key) && (key.startsWith('yaxis') || key.startsWith('xaxis'))) {
        delete this.layout[key];
      }
    }
    // reset counter
    this.counterYAxis = 0;
    this.counterXAxis = 0;
  }

  private clearData() {
    this.preparedData = [];
  }

}
