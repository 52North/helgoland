import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset.module';

import { Dataset, PlatformTypes, ValueTypes } from './../../toolbox/model/api/dataset';
import { Settings } from './../../toolbox/services/settings/settings.service';
import { TrajectoriesService } from './../services/trajectories.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class TrajectoriesSelectionComponent implements OnInit {

  public platformParams = [
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

  public phenomenonParams = [
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

  public paramFilter: any;
  public providerList: any;
  public providerBlacklist: any;
  public providerFilter: any;
  public selectedProvider: any;
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

  public providerSelected(provider) {
    this.selectedProvider = [{
      serviceID: provider.id,
      url: provider.providerUrl
    }];
    this.paramFilter = this.createFilter();
    this.tabset.select('selectByPlatform');
  }

  public datasetSelected(dataset: Array<Dataset>, url) {
    if (dataset instanceof Array && dataset.length === 1) {
      this.trajectory.setTrajectory(dataset[0].id, url);
      this.router.navigate(['trajectories/view']);
    }
  }

  private createFilter() {
    return {
      valueTypes: ValueTypes[ValueTypes.quantity],
      platformTypes: PlatformTypes[PlatformTypes.mobile]
    };
  }

}
