import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  BlacklistedService,
  DatasetApi,
  DatasetApiMapping,
  HelgolandDataset,
  HelgolandParameterFilter,
  HelgolandServicesConnector,
  Provider,
  Service,
  Settings,
  SettingsService,
} from '@helgoland/core';
import { FilteredParameter, ListSelectorParameter, ListSelectorService } from '@helgoland/selector';
import { NgbAccordion, NgbPanel, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'n52-provider-parameter-selector',
  templateUrl: './provider-parameter-selector.component.html',
  styleUrls: ['./provider-parameter-selector.component.scss']
})
export class ProviderParameterSeletorComponent implements OnInit {

  @ViewChild('acc', { static: true }) accordion: NgbAccordion;

  @Input() filter: HelgolandParameterFilter;
  @Input() parameters: Array<ListSelectorParameter>;
  @Input() selectorId: string;

  @Output() datasetSelected: EventEmitter<HelgolandDataset[]> = new EventEmitter();

  public activePanel: string;

  public providerFilter: HelgolandParameterFilter;
  public selectedProvider: Array<Provider>;
  public selectedProviderLabel: string;
  public datasetApis: Array<DatasetApi>;
  public providerBlacklist: Array<BlacklistedService>;

  constructor(
    protected listSelectorService: ListSelectorService,
    protected servicesConnector: HelgolandServicesConnector,
    protected apiMapping: DatasetApiMapping,
    protected settingsSrvc: SettingsService<Settings>
  ) { }

  ngOnInit(): void {
    this.datasetApis = this.settingsSrvc.getSettings().datasetApis;
    this.providerBlacklist = this.settingsSrvc.getSettings().providerBlackList;
    this.activePanel = 'provider';
    this.providerFilter = Object.assign({}, this.filter);
  }

  public providerSelected(provider: Service) {
    this.selectedProviderLabel = provider.label;
    this.selectedProvider = [{
      id: provider.id,
      url: provider.apiUrl
    }];
    this.parameters[0].filterList = [{ url: provider.apiUrl, filter: Object.assign({}, this.filter) }];
    this.openPanel(0);
  }

  public itemSelected(item: FilteredParameter, index: number) {
    if (index < this.parameters.length - 1) {
      this.parameters[index].headerAddition = item.label;
      this.activePanel = this.selectorId + '-' + (index + 1);
      this.parameters[index + 1].isDisabled = false;
      // copy filter to new item
      this.parameters[index + 1].filterList = JSON.parse(JSON.stringify(item.filterList));
      // add filter for selected item to next
      this.parameters[index + 1].filterList.forEach((entry) => entry.filter[this.parameters[index].type] = entry.itemId);
      for (let j = index + 1; j < this.parameters.length; j++) {
        this.parameters[j].headerAddition = '';
      }
      this.openPanel(index + 1);
    } else {
      item.filterList.forEach((entry) => {
        entry.filter[this.parameters[index].type] = entry.itemId;
        this.openDataset(entry.url, entry.filter);
      });
    }
  }

  private openPanel(idx: number) {
    this.findPanel(idx).disabled = false;
    setTimeout(() => this.accordion.expand(`${this.selectorId}-${idx}`), 50);
  }

  private openDataset(url: string, params: HelgolandParameterFilter) {
    this.servicesConnector.getDatasets(url, params).subscribe(result => this.datasetSelected.emit(result));
  }

  public onPanelChange(event: NgbPanelChangeEvent) {
    console.log(`Open ${event.panelId}`);
    const id = event.panelId.replace(this.selectorId + '-', '');
    const idx = parseInt(id, 10);
    if (isNaN(idx)) {
      this.disablePanelsFrom(0);
    } else {
      this.disablePanelsFrom(idx + 1);
    }
  }

  private findPanel(idx: number): NgbPanel {
    return this.accordion.panels.find(p => p.id === `${this.selectorId}-${idx}`);
  }

  private disablePanelsFrom(idx: number) {
    if (this.accordion && this.accordion.panels) {
      let i = idx;
      while (this.parameters.length > i) {
        this.findPanel(i).disabled = true;
        i++;
      }
    }
  }

}
