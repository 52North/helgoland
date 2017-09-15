import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset.module';

import { PlatformTypes } from '../../toolbox/model/api/dataset/platformTypes';
import { ValueTypes } from '../../toolbox/model/api/dataset/valueTypes';
import { BlacklistedService } from '../../toolbox/model/config/config';
import { ListSelectorParameter } from './../../toolbox/components/selection/list-selector/list-selector.component';
import { Dataset } from './../../toolbox/model/api/dataset/dataset';
import { ParameterFilter } from './../../toolbox/model/api/parameterFilter';
import { Service } from './../../toolbox/model/api/service';
import { Provider } from './../../toolbox/model/internal/provider';
import { Settings } from './../../toolbox/services/settings/settings.service';
import { TrajectoriesService } from './../services/trajectories.service';

@Component({
  selector: 'trajectories-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TrajectoriesSelectionComponent implements OnInit {

  public platformParams: Array<ListSelectorParameter> = [
    {
      type: 'platform',
      header: 'Mobile Platform'
    }, {
      type: 'offering',
      header: 'Offering'
    }, {
      type: 'feature',
      header: 'Pfad'
    }, {
      type: 'phenomenon',
      header: 'Phänomen'
    }, {
      type: 'dataset',
      header: 'Dataset'
    }
  ];

  public phenomenonParams: Array<ListSelectorParameter> = [
    {
      type: 'phenomenon',
      header: 'Phänomen'
    }, {
      type: 'offering',
      header: 'Offering'
    }, {
      type: 'feature',
      header: 'Pfad'
    }, {
      type: 'dataset',
      header: 'Dataset'
    }
  ];

  @ViewChild('tabset')
  public tabset: NgbTabset;

  public paramFilter: ParameterFilter;
  public providerList: Array<string>;
  public providerBlacklist: Array<BlacklistedService>;
  public providerFilter: ParameterFilter;
  public selectedProvider: Array<Provider>;
  public activeTab: string;

  constructor(
    private settings: Settings,
    private trajectory: TrajectoriesService,
    private router: Router
  ) { }

  public ngOnInit() {
    this.providerList = this.settings.config.restApiUrls;
    this.providerBlacklist = this.settings.config.providerBlackList;
    this.providerFilter = this.createFilter();
    this.paramFilter = this.createFilter();
  }

  public providerSelected(provider: Service) {
    this.selectedProvider = [{
      id: provider.id,
      url: provider.providerUrl
    }];
    this.paramFilter = this.createFilter();
    const id = 'selectByPlatform';
    this.tabset.tabs.find(entry => entry.id === id).disabled = false;
    this.tabset.select(id);
  }

  public datasetSelected(dataset: Array<Dataset>) {
    if (dataset instanceof Array && dataset.length === 1) {
      this.trajectory.setTrajectory(dataset[0].id, dataset[0].url);
      this.router.navigate(['trajectories/view']);
    }
  }

  private createFilter(): ParameterFilter {
    return {
      valueTypes: ValueTypes[ValueTypes.quantity],
      platformTypes: PlatformTypes[PlatformTypes.mobile]
    };
  }

}
