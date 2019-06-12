import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {
  BlacklistedService,
  ColorService,
  Dataset,
  DatasetApi,
  DatasetOptions,
  ParameterFilter,
  PlatformTypes,
  Provider,
  Service,
  Settings,
  SettingsService,
  ValueTypes,
} from '@helgoland/core';
import { ListSelectorParameter } from '@helgoland/selector';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset.module';
import { TranslateService } from '@ngx-translate/core';

import { TrajectoriesService } from './../services/trajectories.service';

@Component({
  selector: 'n52-trajectories-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TrajectoriesSelectionComponent implements OnInit {

  public platformParams: Array<ListSelectorParameter> = [
    {
      type: 'platform',
      header: this.translate.instant('trajectories.parameter.mobile-platform')
    }, {
      type: 'offering',
      header: this.translate.instant('trajectories.parameter.offering')
    }, {
      type: 'feature',
      header: this.translate.instant('trajectories.parameter.path')
    }
  ];

  public phenomenonParams: Array<ListSelectorParameter> = [
    {
      type: 'phenomenon',
      header: this.translate.instant('trajectories.parameter.phenomenon')
    }, {
      type: 'offering',
      header: this.translate.instant('trajectories.parameter.offering')
    }, {
      type: 'feature',
      header: this.translate.instant('trajectories.parameter.path')
    }
  ];

  @ViewChild('tabset')
  public tabset: NgbTabset;

  public paramFilter: ParameterFilter;
  public datasetApis: Array<DatasetApi>;
  public providerBlacklist: Array<BlacklistedService>;
  public providerFilter: ParameterFilter;
  public selectedProvider: Array<Provider>;
  public activeTab: string;

  constructor(
    private settingsSrvc: SettingsService<Settings>,
    private trajectory: TrajectoriesService,
    private translate: TranslateService,
    private router: Router,
    private color: ColorService
  ) { }

  public ngOnInit() {
    this.datasetApis = this.settingsSrvc.getSettings().datasetApis;
    this.providerBlacklist = this.settingsSrvc.getSettings().providerBlackList;
    this.providerFilter = this.createFilter();
    this.paramFilter = this.createFilter();
  }

  public providerSelected(provider: Service) {
    this.selectedProvider = [{
      id: provider.id,
      url: provider.apiUrl
    }];
    this.paramFilter = this.createFilter();
    const id = 'selectByPlatform';
    this.tabset.tabs.find(entry => entry.id === id).disabled = false;
    this.tabset.select(id);
  }

  public datasetSelected(dataset: Array<Dataset>) {
    this.trajectory.removeAllDatasets();
    dataset.forEach(entry => {
      const options = new DatasetOptions(entry.internalId, this.color.getColor());
      options.visible = false;
      this.trajectory.addDataset(entry.internalId, options);
    });
    this.router.navigate(['trajectories/view']);
  }

  private createFilter(): ParameterFilter {
    return {
      valueTypes: ValueTypes.quantity,
      platformTypes: PlatformTypes.mobile
    };
  }

}
