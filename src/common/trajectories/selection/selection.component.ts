import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {
  BlacklistedService,
  ColorService,
  Dataset,
  DatasetApi,
  DatasetOptions,
  DatasetType,
  HelgolandParameterFilter,
  Provider,
} from '@helgoland/core';
import { ListSelectorParameter, MultiServiceFilterEndpoint } from '@helgoland/selector';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
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
      type: MultiServiceFilterEndpoint.procedure,
      header: this.translate.instant('trajectories.parameter.mobile-platform')
    }, {
      type: MultiServiceFilterEndpoint.offering,
      header: this.translate.instant('trajectories.parameter.offering')
    }, {
      type: MultiServiceFilterEndpoint.feature,
      header: this.translate.instant('trajectories.parameter.path')
    }
  ];

  public phenomenonParams: Array<ListSelectorParameter> = [
    {
      type: MultiServiceFilterEndpoint.phenomenon,
      header: this.translate.instant('trajectories.parameter.phenomenon')
    }, {
      type: MultiServiceFilterEndpoint.offering,
      header: this.translate.instant('trajectories.parameter.offering')
    }, {
      type: MultiServiceFilterEndpoint.feature,
      header: this.translate.instant('trajectories.parameter.path')
    }
  ];

  @ViewChild('tabset', { static: true })
  public tabset: NgbTabset;

  public paramFilter: HelgolandParameterFilter;
  public datasetApis: Array<DatasetApi>;
  public providerBlacklist: Array<BlacklistedService>;
  public providerFilter: HelgolandParameterFilter;
  public selectedProvider: Array<Provider>;
  public activeTab: string;

  constructor(
    private trajectory: TrajectoriesService,
    private translate: TranslateService,
    private router: Router,
    private color: ColorService
  ) { }

  public ngOnInit() {
    this.providerFilter = this.createFilter();
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

  private createFilter(): HelgolandParameterFilter {
    return {
      type: DatasetType.Trajectory
    };
  }

}
